import { Redis } from "ioredis";
import pg from 'pg';
const { Client } = pg;
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const client = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
});
const db = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function verifyApplication(application: string) {
    const { airdropId, signature } = JSON.parse(application);

    try {
        const queryText = `SELECT * FROM "Airdrop" WHERE id = $1`;
        const result = await db.query(queryText, [airdropId]);

        console.log(signature, airdropId);
        let verificationResponse = await axios.post('https://solana-devnet.g.alchemy.com/v2/AlZpXuvewHz3Ty-rYFKn1Oc1kuMtDk8e', {
            jsonrpc: "2.0",
            id: 1,
            method: "getTransaction",
            params: [
                signature,
                "json"
            ]     
        });

        while (verificationResponse.data.result === null) {
            console.log("trying to get transaction again...");
            verificationResponse = await axios.post('https://solana-devnet.g.alchemy.com/v2/AlZpXuvewHz3Ty-rYFKn1Oc1kuMtDk8e', {
                jsonrpc: "2.0",
                id: 1,
                method: "getTransaction",
                params: [
                    signature,
                    "json"
                ]     
            });
        }

        console.log("verificationResponse: ", verificationResponse.data);

        const transaction = verificationResponse.data.result;
        const escrowPostBalance = transaction.meta.postTokenBalances[0].uiTokenAmount.uiAmount;
        const escrowPrevBalance = transaction.meta.preTokenBalances[0].uiTokenAmount.uiAmount;
        console.log("escrowPostBalance: ", escrowPostBalance)
        console.log("escrowPrevBalance: ", escrowPrevBalance)

        const transactionAmount = escrowPostBalance - escrowPrevBalance;
        const transactionAmountFromDb = result.rows[0].amount;

        console.log("transactionAmount: ", transactionAmount);
        console.log("transactionAmountFromDb: ", transactionAmountFromDb);

        if(transactionAmount !== transactionAmountFromDb) {
            console.log("Application not verified.");
            await db.query(`DELETE FROM "Airdrop" WHERE id = $1`, [airdropId]);
        }
        
        console.log("Application verified")
    } catch (error) {
        console.log("can not verify signature: ", error);
    }
}

async function startWorker() {
    try {
        console.log("Worker connected to Redis.");
        await db.connect();
        console.log("Worker connected to Database.");

        while (true) {
            try {
                const application = await client.brpop("airdrop_applications", 0);
                console.log(application);
                
                setTimeout(async() => {
                    // @ts-ignore
                    await verifyApplication(application[1]);
                }, 10000);
            } catch (error) {
                console.error("Error processing submission:", error);
            }
        }
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startWorker();