import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import redis from "@/app/lib/redis";

const client = new PrismaClient();

export async function POST(req: NextRequest){
    const body = await req.json();

    try {    
        const session = await auth();
        console.log(session)
        if(!session) {
            return NextResponse.json({
                success: false,
                message: 'session expired'
            });
        }

        if(!session?.accessToken || !session.user?.email) {
            // Send Revert transaction to the queue
            const revertData = {
                mint: body.tokenMint,
                recieverPublicKey: body.creatorPublicKey,
                amount: body.totalAmount.toString(),
                decimal: body.tokenDecimal.toString()
            };

            await redis.lpush('transactions_to_be_reverted', JSON.stringify(revertData));

            return NextResponse.json({
                success: false,
                message: 'user unauthorized'
            });
        }

        const userprofile = await client.user.findFirst({
            where: {
                email: session.user?.email
            }
        });

        if(!userprofile) {
            return NextResponse.json({
                success: false,
                message: 'user not found'
            });
        }

        const airdrop = await client.airdrop.create({
            data: {
                creatorId: userprofile.id,
                title: body.title,
                description: body.description,
                amount: body.totalAmount,
                coverPicture: body.coverPictureURL!== "" ? body.coverPictureURL : session.user.image,
                basedOn: body.basedOn,
                channelId: body.channelId,
                tokenName: body.tokenName,
                tokenDecimal: body.tokenDecimal,
                tokenMint: body.tokenMint,
                rewardLessthanOneYear: body.rewardLessthanOneYear * (10**body.tokenDecimal),
                rewardGreaterthanOneYear: body.rewardGreaterthanOneYear * (10**body.tokenDecimal),
                rewardGreaterthanTwoYears: body.rewardGreaterthanTwoYears * (10**body.tokenDecimal),
                rewardGreaterthanThreeYears: body.rewardGreaterthanThreeYears * (10**body.tokenDecimal),
                rewardGreaterthanFourYears: body.rewardGreaterthanFourYears * (10**body.tokenDecimal),
                rewardGreaterthanFiveYears: body.rewardGreaterthanFiveYears * (10**body.tokenDecimal),
                totalRecipientLessthanOneYear: body.totalRecipientLessthanOneYear,
                totalRecipientGreaterthanOneYear: body.totalRecipientGreaterthanOneYear,
                totalRecipientGreaterthanTwoYears: body.totalRecipientGreaterthanTwoYears,
                totalRecipientGreaterthanThreeYears: body.totalRecipientGreaterthanThreeYears,
                totalRecipientGreaterthanFourYears: body.totalRecipientGreaterthanFourYears,
                totalRecipientGreaterthanFiveYears: body.totalRecipientGreaterthanFiveYears,
            }
        });

        await redis.lpush('airdrop_applications', JSON.stringify({ airdropId: airdrop.id, signature: body.signature }));

        // Push to queue for email service to notify all the followers
        await redis.lpush('airdrop_notification_queue', JSON.stringify({ airdropId: airdrop.id, followers: userprofile.followers }));

        return NextResponse.json({
            success: true,
            airdrop: airdrop
        });
    } catch (error) {
        const err = error as Error;
        console.log(err.message);

        try {
            // Send Revert transaction to the queue
            const revertData = {
                mint: body.tokenMint,
                recieverPublicKey: body.creatorPublicKey,
                amount: body.totalAmount.toString(),
                decimal: body.tokenDecimal.toString()
            };

            await redis.lpush('transactions_to_be_reverted', JSON.stringify(revertData));

            return NextResponse.json({
                success: false,
                message: 'error occured',
            });
        } catch (error) {
            const err = error as Error;
            console.log('redis err: ', err.message);

            return NextResponse.json({
                success: false,
                message: 'error occured redis',
            });
        }
    }
}