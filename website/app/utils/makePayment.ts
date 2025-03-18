import { createAssociatedTokenAccountInstruction, createTransferCheckedInstruction, getAccount, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export async function makePayments (connection: Connection, wallet: WalletContextState, amount: number, tokenMint: string, decimal: number) {
    if(!wallet.publicKey) {
        return { success: false, message: "user's publicKey is missing" }
    };
    if(!process.env.NEXT_PUBLIC_ESCROW_PUBLIC_KEY) {
        return { success: false, message: "escrow publickey is missing" }
    };
    
    console.log("amount: ", amount);
    console.log("decimal: ", decimal);
    
    const escrowPublicKey = new PublicKey(process.env.NEXT_PUBLIC_ESCROW_PUBLIC_KEY)

    if(tokenMint === 'sol') {
        const Ix = SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            lamports: amount*1e9,
            toPubkey: escrowPublicKey
        });
    
        const tx = new Transaction();
    
        tx.add(Ix);
    
        tx.feePayer = wallet.publicKey;
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    
        const signature = await wallet.sendTransaction(tx, connection);
    
        return { success: true, signature: signature }
    } else {
        console.log("spl-token transfer");
        const mint = new PublicKey(tokenMint);

        const associatedTokenAc = getAssociatedTokenAddressSync(
            mint,
            escrowPublicKey,
            false,
            TOKEN_PROGRAM_ID
        );

        console.log("escrow ATA: ", associatedTokenAc.toString());

        try {
            await getAccount(connection, associatedTokenAc);
        } catch (error) {
            console.log("ATA Does not exist: ", error);
            console.log("Creating ATA for escrow");
            const ataCreateTx = new Transaction().add(
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    associatedTokenAc,
                    escrowPublicKey,
                    mint,
                    TOKEN_PROGRAM_ID
                )
            );

            ataCreateTx.feePayer = wallet.publicKey;
            ataCreateTx.recentBlockhash = (
                await connection.getLatestBlockhash()
            ).blockhash;
        
            const AtaCreationSignature = await wallet.sendTransaction(ataCreateTx, connection);
            console.log("associated token account created, explore the signature: ", AtaCreationSignature);
        }

        const walletATA = getAssociatedTokenAddressSync(
            mint,
            wallet.publicKey,
            false,
            TOKEN_PROGRAM_ID
        );
        console.log("wallet ATA: ", walletATA.toString());
        
        const transferIx = createTransferCheckedInstruction(
            walletATA,
            mint,
            associatedTokenAc,
            wallet.publicKey,
            amount*(10**decimal),
            decimal
        );

        const tx = new Transaction();
        tx.add(transferIx);

        tx.feePayer = wallet.publicKey;
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signature = await wallet.sendTransaction(tx, connection);

        return { success: true, signature: signature }
    }
}