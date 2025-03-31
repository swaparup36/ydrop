import { Redis } from 'ioredis';
import dotenv from 'dotenv';
import pg from 'pg';
import { airdropDetailType } from './types';
import { sendMail } from './mailer';
const { Client } = pg;

dotenv.config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379/');

const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function sendAirdropNotification(airdropDetails: string) {
    try {
        const { airdropId, followers } = JSON.parse(airdropDetails);

        // Get Airdrop details from the db using airdropId
        const queryText = `SELECT * FROM "Airdrop" WHERE id = $1`;
        const airdropResult = await db.query(queryText, [airdropId]);
        const airdrop = airdropResult.rows[0];
        console.log("airdrop: ", airdropResult);
        if(!airdrop) {
            return console.log("Can not send airdrop notification: Invalid airdropId");
        }

        // Get the creator of the airdrop from user table using creatorId of the airdrop
        const creatorResult = await db.query(`SELECT * FROM "User" WHERE id = $1`, [airdrop.creatorId]);
        const creator = creatorResult.rows[0];
        console.log("creator: ", creator);
        if (!creator) {
            return console.log("Can not send airdrop notification: Invalid creatorId");
        }

        // Contruct the airdrop details
        const airdropDetail: airdropDetailType = {
            id: airdrop.id,
            title: airdrop.title,
            coverPicture: airdrop.coverPicture,
            description: airdrop.description,
            creatorName: creator.name,
            amount: airdrop.amount,
            basedOn: airdrop.basedOn,
            tokenMint: airdrop.tokenMint,
            tokenName: airdrop.tokenName
        };

        // Get all user's email from the db using their id from followers array
        for (const follower of followers) {
            const query = `SELECT email FROM "User" WHERE id = $1`;
            const result = await db.query(query, [follower]);
            const user = result.rows[0];
            if (user) {
                // Send email to user
                const sendMailResponse = await sendMail({
                    email: 'crampusgaming@gmail.com',
                    sendTo: user.email,
                    subject: 'Airdrop Notification',
                    airdropDetail: airdropDetail,
                });
                console.log("sendMailResponse: ", sendMailResponse);
                if (sendMailResponse.success) {
                    console.log("Airdrop notification sent to: ", user.email);
                } else {
                    console.log("Failed to send airdrop notification to: ", user.email);
                }
            }
        }

    } catch (error) {
        console.log("can not send airdrop notifications: ", error);
    }
}

async function startWorker() {
    try {
        await db.connect();
        console.log("Connected to PostgreSQL database.");
        console.log("Worker connected to Redis.");

        while (true) {
            try {
                const airdropDetails = await redis.brpop("airdrop_notification_queue", 0);
                console.log(airdropDetails);
                
                setTimeout(async() => {
                    // @ts-ignore
                    await sendAirdropNotification(airdropDetails[1]);
                }, 10000);
            } catch (error) {
                console.error("Error sending notifications:", error);
            }
        }
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startWorker();
