import { Redis } from 'ioredis';
import dotenv from 'dotenv';
import { clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import pkg from 'bs58';
import { createTransferCheckedInstruction, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token';

dotenv.config();
const { decode } = pkg;

const connection = new Connection(clusterApiUrl("devnet"));
 
const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
});

async function revertTransaction(credential: string) {
    try {
        const { recieverPublicKey, mint, amount, decimal } = JSON.parse(credential);

        if(!process.env.ESCROW_PRIVATEKEY) {
            return console.log("can not revert the transaction: escrow private key is missing");
        }
    
        const escrowKeyPair = Keypair.fromSecretKey(decode(process.env.ESCROW_PRIVATEKEY));
        const recieverPubKey = new PublicKey(recieverPublicKey);

        const mintPubKey = new PublicKey(mint);
        const associatedTokenAc = getAssociatedTokenAddressSync(
            mintPubKey,
            recieverPubKey,
            false,
            TOKEN_PROGRAM_ID
        );

        const escrowtATA = getAssociatedTokenAddressSync(
            mintPubKey,
            escrowKeyPair.publicKey,
            false,
            TOKEN_PROGRAM_ID
        );

        const transaction = new Transaction();
        const transferIx = createTransferCheckedInstruction(
            new PublicKey(escrowtATA),
            new PublicKey(mint),
            new PublicKey(associatedTokenAc),
            escrowKeyPair.publicKey,
            parseInt(amount)*(10**parseInt(decimal)),
            parseInt(decimal)
        );

        transaction.add(transferIx);

        const signature = await sendAndConfirmTransaction(connection, transaction, [escrowKeyPair]);

        console.log("Transaction reverted. Elplore the signature: ", signature);
    } catch (error) {
        console.log("can not revert the transaction: ", error);
    }
}

async function startWorker() {
    try {
        console.log("Worker connected to Redis.");

        while (true) {
            try {
                const credential = await redis.brpop("transactions_to_be_reverted", 0);
                console.log(credential);
                
                setTimeout(async() => {
                    // @ts-ignore
                    await revertTransaction(credential[1]);
                }, 10000);
            } catch (error) {
                console.error("Error processing transaction:", error);
            }
        }
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startWorker();