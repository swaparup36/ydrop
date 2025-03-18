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
const pg_1 = __importDefault(require("pg"));
const { Client } = pg_1.default;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const client = new ioredis_1.Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
});
const db = new Client({
    connectionString: process.env.DATABASE_URL,
});
function verifyApplication(application) {
    return __awaiter(this, void 0, void 0, function* () {
        const { airdropId, signature } = JSON.parse(application);
        try {
            const queryText = `SELECT * FROM "Airdrop" WHERE id = $1`;
            const result = yield db.query(queryText, [airdropId]);
            console.log(signature, airdropId);
            let verificationResponse = yield axios_1.default.post('https://solana-devnet.g.alchemy.com/v2/AlZpXuvewHz3Ty-rYFKn1Oc1kuMtDk8e', {
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
                verificationResponse = yield axios_1.default.post('https://solana-devnet.g.alchemy.com/v2/AlZpXuvewHz3Ty-rYFKn1Oc1kuMtDk8e', {
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
            console.log("escrowPostBalance: ", escrowPostBalance);
            console.log("escrowPrevBalance: ", escrowPrevBalance);
            const transactionAmount = escrowPostBalance - escrowPrevBalance;
            const transactionAmountFromDb = result.rows[0].amount;
            console.log("transactionAmount: ", transactionAmount);
            console.log("transactionAmountFromDb: ", transactionAmountFromDb);
            if (transactionAmount !== transactionAmountFromDb) {
                console.log("Application not verified.");
                yield db.query(`DELETE FROM "Airdrop" WHERE id = $1`, [airdropId]);
            }
            console.log("Application verified");
        }
        catch (error) {
            console.log("can not verify signature: ", error);
        }
    });
}
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Worker connected to Redis.");
            yield db.connect();
            console.log("Worker connected to Database.");
            while (true) {
                try {
                    const application = yield client.brpop("airdrop_applications", 0);
                    console.log(application);
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        // @ts-ignore
                        yield verifyApplication(application[1]);
                    }), 10000);
                }
                catch (error) {
                    console.error("Error processing submission:", error);
                }
            }
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    });
}
startWorker();
