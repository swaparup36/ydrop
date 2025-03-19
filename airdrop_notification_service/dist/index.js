"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = __importDefault(require("pg"));
const mailer_1 = require("./mailer");
const { Client } = pg_1.default;
dotenv_1.default.config();
// Dev mode
// const redis = new Redis({
//     host: process.env.REDIS_HOST || '127.0.0.1',
//     port: parseInt(process.env.REDIS_PORT || '6379'),
// });
// Productio mode
// const redis = new Redis({
//     host: process.env.REDIS_HOST || '127.0.0.1',
//     port: parseInt(process.env.REDIS_PORT || '6379'),
//     username: process.env.REDIS_USER || '',
//     password: process.env.REDIS_PASSWORD || '',
//     tls: {}
// });
const redis = new ioredis_1.Redis(process.env.REDIS_URL || 'http://localhost:6379/');
const db = new Client({
    connectionString: process.env.DATABASE_URL,
});
function sendAirdropNotification(airdropDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { airdropId, followers } = JSON.parse(airdropDetails);
            // Get Airdrop details from the db using airdropId
            const queryText = `SELECT * FROM "Airdrop" WHERE id = $1`;
            const airdropResult = yield db.query(queryText, [airdropId]);
            const airdrop = airdropResult.rows[0];
            console.log("airdrop: ", airdropResult);
            if (!airdrop) {
                return console.log("Can not send airdrop notification: Invalid airdropId");
            }
            // Get the creator of the airdrop from user table using creatorId of the airdrop
            const creatorResult = yield db.query(`SELECT * FROM "User" WHERE id = $1`, [airdrop.creatorId]);
            const creator = creatorResult.rows[0];
            console.log("creator: ", creator);
            if (!creator) {
                return console.log("Can not send airdrop notification: Invalid creatorId");
            }
            // Contruct the airdrop details
            const airdropDetail = {
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
                const result = yield db.query(query, [follower]);
                const user = result.rows[0];
                if (user) {
                    // Send email to user
                    const sendMailResponse = yield (0, mailer_1.sendMail)({
                        email: 'crampusgaming@gmail.com',
                        sendTo: user.email,
                        subject: 'Airdrop Notification',
                        airdropDetail: airdropDetail,
                    });
                    console.log("sendMailResponse: ", sendMailResponse);
                    if (sendMailResponse.success) {
                        console.log("Airdrop notification sent to: ", user.email);
                    }
                    else {
                        console.log("Failed to send airdrop notification to: ", user.email);
                    }
                }
            }
        }
        catch (error) {
            console.log("can not send airdrop notifications: ", error);
        }
    });
}
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db.connect();
            console.log("Connected to PostgreSQL database.");
            console.log("Worker connected to Redis.");
            while (true) {
                try {
                    const airdropDetails = yield redis.brpop("airdrop_notification_queue", 0);
                    console.log(airdropDetails);
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        // @ts-ignore
                        yield sendAirdropNotification(airdropDetails[1]);
                    }), 10000);
                }
                catch (error) {
                    console.error("Error sending notifications:", error);
                }
            }
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    });
}
startWorker();
