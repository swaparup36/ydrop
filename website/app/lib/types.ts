import { PublicKey } from "@solana/web3.js"

export type Airdrop = {
    amount: number;
    basedOn: string;
    coverPicture: string;
    channelId: string;
    creatorId: string;
    description: string;
    id: string;
    rewardGreaterthanFiveYears: number;
    rewardGreaterthanFourYears: number;
    rewardGreaterthanOneYear: number;
    rewardGreaterthanThreeYears: number;
    rewardGreaterthanTwoYears:  number;
    rewardLessthanOneYear: number;
    startDate: string;
    title: string;
    totalRecipientGreaterthanFiveYears: number;
    totalRecipientGreaterthanFourYears: number;
    totalRecipientGreaterthanOneYear: number;
    totalRecipientGreaterthanThreeYears: number;
    totalRecipientGreaterthanTwoYears: number;
    totalRecipientLessthanOneYear: number;
    tokenDecimal: number,
    tokenMint: string;
    tokenName: string;
}

export type tokenAccount = {
    name: string; 
    symbol: string; 
    image: string; 
    mint: PublicKey; 
    amount: number; 
    decimals: number;
}

export type featuredCreatorsType = {
    userId: string;
    name: string;
    email: string;
    image: string;
    airdropImages: string[];
}