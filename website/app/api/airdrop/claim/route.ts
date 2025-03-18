import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import pkg from 'bs58';
import { createTransferCheckedInstruction, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const { decode } = pkg;

const client = new PrismaClient();
const connection = new Connection(clusterApiUrl("devnet"));

export async function POST(req: NextRequest){
    const body = await req.json();
    try {
        const session = await auth();
        if(!session) {
            return NextResponse.json({
                success: false,
                message: 'session expired'
            });
        }

        if(!session?.accessToken || !session.user?.email) {
            return NextResponse.json({
                success: false,
                message: 'user unauthorized'
            });
        }

        if(!process.env.ESCROW_PRIVATEKEY) {
            return NextResponse.json({
                success: false,
                message: 'escrow publickey not found'
            });
        }

        const escrowKeyPair = Keypair.fromSecretKey(decode(process.env.ESCROW_PRIVATEKEY));

        const userProfile = await client.user.findFirst({
            where: {
                email: session.user.email
            }
        });

        if(!userProfile) {
            return NextResponse.json({
                success: false,
                message: 'user not found'
            });
        }

        const requiredAirdrop = await client.airdrop.findUnique({
            where: {
                id: body.airdropId,
                isActive: true
            }
        });

        if(!requiredAirdrop) {
            return NextResponse.json({
                success: false,
                message: 'airdrop not found'
            });
        }

        console.log(requiredAirdrop);

        if(requiredAirdrop.recipientsLessthanOneYear.includes(userProfile.id) || requiredAirdrop.recipientsGreaterthanOneYear.includes(userProfile.id) || requiredAirdrop.recipientsGreaterthanTwoYears.includes(userProfile.id) || requiredAirdrop.recipientsGreaterthanThreeYears.includes(userProfile.id) || requiredAirdrop.recipientsGreaterthanFourYears.includes(userProfile.id) || requiredAirdrop.recipientsGreaterthanFiveYears.includes(userProfile.id)) {
            return NextResponse.json({
                success: false,
                message: 'user has already claimed this airdrop'
            });
        }
        
        console.log("amount: ", body.amount);
        const transaction = new Transaction();

        if(requiredAirdrop.tokenMint === 'sol') {
            // Transfer the airdrop amount to the user
            const transferIx = SystemProgram.transfer({
                fromPubkey: escrowKeyPair.publicKey,
                toPubkey: body.userPublicKey,
                lamports: body.amount
            });

            transaction.add(transferIx);

            transaction.feePayer = escrowKeyPair.publicKey;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        } else {
            console.log("spl-token transfer");
            const mint = new PublicKey(requiredAirdrop.tokenMint);
            const recieverPublicKey = new PublicKey(body.userPublicKey);

            const associatedTokenAc = getAssociatedTokenAddressSync(
                mint,
                recieverPublicKey,
                false,
                TOKEN_PROGRAM_ID
            );

            console.log("reciever's ATA: ", associatedTokenAc.toString());

            const escrowtATA = getAssociatedTokenAddressSync(
                mint,
                escrowKeyPair.publicKey,
                false,
                TOKEN_PROGRAM_ID
            );
            console.log("escrow ATA: ", escrowtATA.toString());

            // make sure reciever's ATA exists
            let ataExists = false;
            const maxAttempts = 10;
            let attempts = 0;

            while (!ataExists && attempts < maxAttempts) {
                try {
                    const account = await connection.getAccountInfo(associatedTokenAc);
                    if (account !== null) {
                        ataExists = true;
                        console.log("Receiver's ATA found!");
                    } else {
                        console.log(`Attempt ${attempts + 1}: Waiting for receiver's ATA to be created...`);
                        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between attempts
                        attempts++;
                    }
                } catch (error) {
                    console.log(`Attempt ${attempts + 1}: Error checking ATA:`, error);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    attempts++;
                }
            }

            if (!ataExists) {
                return NextResponse.json({
                    success: false,
                    message: "Receiver's Associated Token Account not found after multiple attempts"
                });
            }

            const transferIx = createTransferCheckedInstruction(
                escrowtATA,
                mint,
                associatedTokenAc,
                escrowKeyPair.publicKey,
                body.amount,
                requiredAirdrop.tokenDecimal
            );
            transaction.add(transferIx);
        }
        
        const signature = await sendAndConfirmTransaction(connection, transaction, [escrowKeyPair]);

        if (requiredAirdrop.rewardLessthanOneYear === body.amount) {
            const recipientsLessthanOneYear = requiredAirdrop.recipientsLessthanOneYear;
            const updatedAirdrop = await client.airdrop.update({
                where: {
                    id: requiredAirdrop.id,
                },
                data: {
                    recipientsLessthanOneYear: [ ...recipientsLessthanOneYear, userProfile.id ]
                }
            });
            console.log(updatedAirdrop);
        } else if (requiredAirdrop.rewardGreaterthanOneYear === body.amount) {
            const recipientsGreaterthanOneYear = requiredAirdrop.recipientsGreaterthanOneYear;
            const updatedAirdrop = await client.airdrop.update({
                where: {
                    id: requiredAirdrop.id,
                },
                data: {
                    recipientsGreaterthanOneYear: [ ...recipientsGreaterthanOneYear, userProfile.id ]
                }
            });
            console.log(updatedAirdrop);
        } else if (requiredAirdrop.rewardGreaterthanTwoYears === body.amount) {
            const recipientsGreaterthanTwoYears = requiredAirdrop.recipientsGreaterthanTwoYears;
            const updatedAirdrop = await client.airdrop.update({
                where: {
                    id: requiredAirdrop.id,
                },
                data: {
                    recipientsGreaterthanTwoYears: [ ...recipientsGreaterthanTwoYears, userProfile.id ]
                }
            });
            console.log(updatedAirdrop);
        } else if (requiredAirdrop.rewardGreaterthanThreeYears === body.amount) {
            const recipientsGreaterthanThreeYears = requiredAirdrop.recipientsGreaterthanThreeYears;
            const updatedAirdrop = await client.airdrop.update({
                where: {
                    id: requiredAirdrop.id,
                },
                data: {
                    recipientsGreaterthanThreeYears: [ ...recipientsGreaterthanThreeYears, userProfile.id ]
                }
            });
            console.log(updatedAirdrop);
        } else if (requiredAirdrop.rewardGreaterthanFourYears === body.amount) {
            const recipientsGreaterthanFourYears = requiredAirdrop.recipientsGreaterthanFourYears;
            const updatedAirdrop = await client.airdrop.update({
                where: {
                    id: requiredAirdrop.id,
                },
                data: {
                    recipientsGreaterthanFourYears: [ ...recipientsGreaterthanFourYears, userProfile.id ]
                }
            });
            console.log(updatedAirdrop);
        } else if (requiredAirdrop.rewardGreaterthanFiveYears === body.amount) {
            const recipientsGreaterthanFiveYears = requiredAirdrop.recipientsGreaterthanFiveYears;
            const updatedAirdrop = await client.airdrop.update({
                where: {
                    id: requiredAirdrop.id,
                },
                data: {
                    recipientsGreaterthanFiveYears: [ ...recipientsGreaterthanFiveYears, userProfile.id ]
                }
            });
            console.log(updatedAirdrop);
        } else {
            return NextResponse.json({
                success: false,
                message: "airdrop is not updated"
            });
        }

        return NextResponse.json({
            success: true,
            signature: signature
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}