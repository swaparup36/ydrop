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
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const spl_token_1 = require("@solana/spl-token");
dotenv_1.default.config();
const { decode } = bs58_1.default;
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"));
const redis = new ioredis_1.Redis(process.env.REDIS_URL || 'redis://localhost:6379/');
function revertTransaction(credential) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { recieverPublicKey, mint, amount, decimal } = JSON.parse(credential);
            if (!process.env.ESCROW_PRIVATEKEY) {
                return console.log("can not revert the transaction: escrow private key is missing");
            }
            const escrowKeyPair = web3_js_1.Keypair.fromSecretKey(decode(process.env.ESCROW_PRIVATEKEY));
            const recieverPubKey = new web3_js_1.PublicKey(recieverPublicKey);
            const mintPubKey = new web3_js_1.PublicKey(mint);
            const associatedTokenAc = (0, spl_token_1.getAssociatedTokenAddressSync)(mintPubKey, recieverPubKey, false, spl_token_1.TOKEN_PROGRAM_ID);
            const escrowtATA = (0, spl_token_1.getAssociatedTokenAddressSync)(mintPubKey, escrowKeyPair.publicKey, false, spl_token_1.TOKEN_PROGRAM_ID);
            const transaction = new web3_js_1.Transaction();
            const transferIx = (0, spl_token_1.createTransferCheckedInstruction)(new web3_js_1.PublicKey(escrowtATA), new web3_js_1.PublicKey(mint), new web3_js_1.PublicKey(associatedTokenAc), escrowKeyPair.publicKey, parseInt(amount) * (10 ** parseInt(decimal)), parseInt(decimal));
            transaction.add(transferIx);
            const signature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [escrowKeyPair]);
            console.log("Transaction reverted. Elplore the signature: ", signature);
        }
        catch (error) {
            console.log("can not revert the transaction: ", error);
        }
    });
}
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Worker connected to Redis.");
            while (true) {
                try {
                    const credential = yield redis.brpop("transactions_to_be_reverted", 0);
                    console.log(credential);
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        // @ts-ignore
                        yield revertTransaction(credential[1]);
                    }), 10000);
                }
                catch (error) {
                    console.error("Error processing transaction:", error);
                }
            }
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    });
}
startWorker();
