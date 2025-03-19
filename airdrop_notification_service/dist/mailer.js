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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    host: SMTP_SERVER_HOST,
    port: 587,
    secure: true,
    auth: {
        user: SMTP_SERVER_USERNAME,
        pass: SMTP_SERVER_PASSWORD,
    },
});
function sendMail(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, sendTo, subject, airdropDetail, }) {
        try {
            const isVerified = yield transporter.verify();
            if (!isVerified) {
                console.error('SMTP Server Not Verified');
                return { success: false, message: 'SMTP Server Not Verified' };
            }
            const info = yield transporter.sendMail({
                from: email,
                to: sendTo,
                subject: subject,
                text: '',
                html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Airdrop Alert - Ydrop</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f7f5ff;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                            text-align: center;
                        }
                        .header {
                            background-color: #6a0dad;
                            color: white;
                            padding: 15px;
                            font-size: 24px;
                            font-weight: bold;
                            border-radius: 10px 10px 0 0;
                        }
                        .airdrop-cover {
                            width: 100%;
                            border-radius: 10px;
                            margin-top: 15px;
                        }
                        .content {
                            padding: 15px;
                            text-align: left;
                        }
                        .highlight {
                            color: #6a0dad;
                            font-weight: bold;
                        }
                        .cta-button {
                            display: inline-block;
                            background-color: #6a0dad;
                            color: white !important;
                            text-decoration: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            margin-top: 20px;
                            font-size: 16px;
                            font-weight: bold;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 14px;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">🚀 New Airdrop Alert on Ydrop!</div>
                        <img class="airdrop-cover" src=${airdropDetail.coverPicture} alt="Airdrop Cover" />
                        <div class="content">
                            <h2>${airdropDetail.title}</h2>
                            <p>${airdropDetail.description}</p>
                            <p><span class="highlight">Created by:</span>${airdropDetail.creatorName}</p>
                            <p><span class="highlight">Based On:</span> ${airdropDetail.basedOn}</p>
                            <p><span class="highlight">Total Amount:</span> ${airdropDetail.amount} ${airdropDetail.tokenName}</p>
                            <p><span class="highlight">Token Mint Address:</span> ${airdropDetail.tokenMint}</p>
                            <a href="https://ydrop.com/airdrop/${airdropDetail.id}" class="cta-button">Claim Airdrop</a>
                        </div>
                        <div class="footer">
                            <p>You're receiving this email because you follow ${airdropDetail.creatorName} on Ydrop.</p>
                        </div>
                    </div>
                </body>
            </html>
        `,
            });
            console.log('Message Sent', info.messageId);
            console.log('Mail sent to', SITE_MAIL_RECIEVER);
            return { info, success: true };
        }
        catch (error) {
            console.error('Something Went Wrong', SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);
            return { success: false, message: error };
        }
    });
}
exports.sendMail = sendMail;
