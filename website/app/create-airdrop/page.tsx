"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { signOut } from 'next-auth/react';
import { Coins, Upload, Users } from "lucide-react";
import { FaParachuteBox } from "react-icons/fa6";
import { createAirdropSchema } from "../lib/schema";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { makePayments } from "../utils/makePayment";
import axios from "axios";
import { getTokensWithMetadata } from "../utils/getAllTokenAccounts";
import { tokenAccount } from "../lib/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import uploadImage from "../utils/uploader";

export default function CreateAirdrop() {
    const router = useRouter();
    const wallet = useWallet();
    const { connection } = useConnection();

    const [airdropFormData, setAirdropFormData] = useState({
        title: "",
        description: "",
        tokenName: "",
        tokenMint: "",
        tokenDecimal: 9,
        basedOn: "",
        rewardLessthanOneYear: 0,
        rewardGreaterthanOneYear: 0,
        rewardGreaterthanTwoYears: 0,
        rewardGreaterthanThreeYears: 0,
        rewardGreaterthanFourYears: 0,
        rewardGreaterthanFiveYears: 0,
        totalRecipientLessthanOneYear: 0,
        totalRecipientGreaterthanOneYear: 0,
        totalRecipientGreaterthanTwoYears: 0,
        totalRecipientGreaterthanThreeYears: 0,
        totalRecipientGreaterthanFourYears: 0,
        totalRecipientGreaterthanFiveYears: 0
    });
    const [coverPicture, setCoverPicture] = useState<File | null>(null);
    const [coverPicturePreviewURL, setCoverPicturePreviewURL] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string> | null>(null);
    const [tokenAccounts, setTokenAccounts] = useState<tokenAccount[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGetTokensLoading, setIsGetTokensLoading] = useState<boolean>(false);

    function handleOnChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value, type } = e.target;
        
        if(type === 'number') {
            setAirdropFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
        } else {
            setAirdropFormData((prev) => ({ ...prev, [name]: value }));
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const validationResult = createAirdropSchema.safeParse(airdropFormData);
            if(!validationResult.success) {
                const fieldErrors = validationResult.error.flatten().fieldErrors;
                const errs = Object.fromEntries(
                    Object.entries(fieldErrors).map(([key, messages]) => [key, messages?.[0] || "Invalid field"])
                )
                setErrors(errs);
                return console.log("zod error: ", errs);
            }

            if(airdropFormData.tokenMint === "" || airdropFormData.tokenName === "") {
                return console.log("Select a Token or NFT");
            }

            // Getting the channelId
            const channelIdResponse = await axios.get('/api/user/getChannelId');
            if(!channelIdResponse.data.success) {
                signOut();
                router.push('/');
                return console.log("Error getting channel id: ", channelIdResponse.data.message);

            }

            const channelId = channelIdResponse.data.channelId;

            // Upload cover picture
            let coverPictureURL = "";
            const formData = new FormData();
            if(coverPicture) {
                formData.append('file', coverPicture);
            }
            const uploadCoverPicRes = await uploadImage(formData);
            const uploadCoverPicResObj = JSON.parse(uploadCoverPicRes);
            if (!uploadCoverPicResObj.success) {
                return console.log("Error uploading cover picture: ", uploadCoverPicResObj.error);
            }
            coverPictureURL = uploadCoverPicResObj.imageURL;

            // Get total amount to be deposited from user's wallet for the airdrop
            let totalAmount = 
            (airdropFormData.rewardLessthanOneYear * airdropFormData.totalRecipientLessthanOneYear) + 
            (airdropFormData.rewardGreaterthanOneYear * airdropFormData.totalRecipientGreaterthanOneYear) + 
            (airdropFormData.rewardGreaterthanTwoYears * airdropFormData.totalRecipientGreaterthanTwoYears) + 
            (airdropFormData.rewardGreaterthanThreeYears * airdropFormData.totalRecipientGreaterthanThreeYears) + 
            (airdropFormData.rewardGreaterthanFourYears * airdropFormData.totalRecipientGreaterthanFourYears) + 
            (airdropFormData.rewardGreaterthanFiveYears * airdropFormData.totalRecipientGreaterthanFiveYears);

            totalAmount = Math.trunc(totalAmount);

            // Call function to make payment for airdrop
            console.log("mint address: ", airdropFormData.tokenMint);
            const paymentResponse = await makePayments(connection, wallet, totalAmount, airdropFormData.tokenMint, airdropFormData.tokenDecimal);
            if(!paymentResponse.success) {
                return console.log(paymentResponse.message);
            }

            // calling backend to create airdrop
            const createAirdropResponse = await axios.post('/api/airdrop/create', { 
                channelId: channelId, 
                creatorPublicKey: wallet.publicKey, 
                signature: paymentResponse.signature, 
                totalAmount,
                coverPictureURL,
                ...airdropFormData 
            });

            if(!createAirdropResponse.data.success) {
                return console.log("Can not create airdrop: ", createAirdropResponse.data.message);
            }

            router.push('/explore');
        } catch (error) {
            console.error("Error creating airdrop:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function getTokenAccounts() {
        setIsGetTokensLoading(true);
        try {
            if(!wallet.publicKey) {
                setIsGetTokensLoading(false);
                return console.log("can not get publicKey");
            }
            const accounts = await getTokensWithMetadata(wallet.publicKey);
            console.log("accounts: ", accounts);
            if(!accounts) { 
                setIsGetTokensLoading(false);
                return console.log("no accounts found");
            }
            setTokenAccounts(accounts);
        } catch (error) {
            console.log(error);
        } finally {
            setIsGetTokensLoading(false);
        }
    }

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const inputClasses = "bg-purple-900/20 border border-purple-500/20 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-400";
    const labelClasses = "text-sm font-medium text-gray-300 my-5";
    const errorClasses = "text-red-400 text-sm mt-1";

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0F0817] to-[#1A1033] text-white py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">
                        Create New
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> Airdrop </span>
                    </h1>
                    <p className="text-gray-400">Set up your airdrop parameters and reward your community</p>
                </motion.div>

                {/* Form */}
                <motion.form
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    onSubmit={handleSubmit}
                    className="bg-gradient-to-br from-purple-900/40 to-transparent p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20"
                >
                    {/* Basic Information */}
                    <div className="space-y-6 mb-8">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <FaParachuteBox className="w-5 h-5 text-purple-400" />
                            Basic Information
                        </h2>
                        
                        <div>
                            <p className={labelClasses}>Cover Picture</p>
                            <label htmlFor="coverPicture" className={`cursor-pointer border-purple-500 border-2 border-dashed rounded-lg flex justify-center items-center ${coverPicture ? '' : 'h-[35svh]'}`}>
                                {
                                    coverPicture ? (
                                        <div className="flex flex-col justify-center items-center">
                                            <Image src={coverPicturePreviewURL} alt="coverPicture" className="w-fit h-fit" width={500} height={500} />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col justify-center items-center">
                                            <Upload className="w-36 mb-2" />
                                            <p>Upload Picture</p>
                                        </div>
                                    )
                                }
                            </label>
                            <input
                                type="file"
                                id="coverPicture"
                                name="coverPicture"
                                placeholder="Enter airdrop title"
                                onChange={(e) => {
                                    const file = e.target.files? e.target.files[0] : null;
                                    
                                    if (file) {
                                        const fileSize = file.size / 1024 / 1024;

                                        if (fileSize > 5) return;

                                        const fileUrl = URL.createObjectURL(file);
                                        setCoverPicturePreviewURL(fileUrl);
                                        setCoverPicture(file);
                                    }
                                }}
                                className="hidden"
                            />
                            {errors?.coverPicture && <p className={errorClasses}>{errors.coverPicture}</p>}
                        </div>

                        <div>
                            <label htmlFor="title" className={labelClasses}>Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Enter airdrop title"
                                value={airdropFormData.title}
                                onChange={handleOnChange}
                                className={inputClasses}
                            />
                            {errors?.title && <p className={errorClasses}>{errors.title}</p>}
                        </div>

                        <div>
                            <label htmlFor="description" className={labelClasses}>Description</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Describe your airdrop"
                                value={airdropFormData.description}
                                onChange={handleOnChange}
                                rows={4}
                                className={inputClasses}
                            />
                            {errors?.description && <p className={errorClasses}>{errors.description}</p>}
                        </div>

                        <div>
                            <label htmlFor="basedOn" className={labelClasses}>Airdrop Basis</label>
                            <select
                                id="basedOn"
                                name="basedOn"
                                value={airdropFormData.basedOn}
                                onChange={handleOnChange}
                                className={inputClasses}
                            >
                                <option className="bg-purple-900" value="">Select a mode</option>
                                <option className="bg-purple-900" value="subscriber">Subscriber</option>
                                <option className="bg-purple-900" value="membership">Membership</option>
                            </select>
                            {errors?.basedOn && <p className={errorClasses}>{errors.basedOn}</p>}
                        </div>

                        {tokenAccounts.length > 0 ? (
                            <div>
                                <label htmlFor="tokenMint" className={labelClasses}>Select Token</label>
                                <select
                                    id="tokenMint"
                                    name="tokenMint"
                                    value={airdropFormData.tokenMint}
                                    onChange={(e) => {
                                        const requiredTokenAc = tokenAccounts.find((tokenAccount) => {
                                            return tokenAccount.mint.toString() === e.target.value;
                                        });
                                        if(!requiredTokenAc) return console.log("invalid token account");
                                        setAirdropFormData({ 
                                            ...airdropFormData, 
                                            tokenMint: requiredTokenAc.mint.toString(),
                                            tokenDecimal: requiredTokenAc.decimals,
                                            tokenName: requiredTokenAc.name
                                        });
                                    }}
                                    className={inputClasses}
                                >
                                    <option className="bg-purple-900" value="">Select a Token</option>
                                    {tokenAccounts.map((tokenAccount, index) => (
                                        <option className="bg-purple-900" key={index} value={tokenAccount.mint.toString()}>
                                            {tokenAccount.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            isGetTokensLoading ? (
                                <motion.button
                                    type="button"
                                    disabled={true}
                                    className="w-full bg-purple-600 opacity-75 cursor-not-allowed text-white px-6 py-3 rounded-full transition duration-300 flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Coins className="w-5 h-5" />
                                    Getting Tokens and NFTs From your wallet...
                                </motion.button>
                            ) : (
                                <motion.button
                                    type="button"
                                    onClick={getTokenAccounts}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition duration-300 flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Coins className="w-5 h-5" />
                                    Get Tokens and NFTs From your wallet
                                </motion.button>
                            )
                        )}
                    </div>

                    {/* Reward Configuration */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Rewards Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Coins className="w-5 h-5 text-purple-400" />
                                Reward Amounts
                            </h2>

                            {[
                                { label: "< 1 Year", reward: "rewardLessthanOneYear" },
                                { label: "> 1 Year", reward: "rewardGreaterthanOneYear" },
                                { label: "> 2 Years", reward: "rewardGreaterthanTwoYears" },
                                { label: "> 3 Years", reward: "rewardGreaterthanThreeYears" },
                                { label: "> 4 Years", reward: "rewardGreaterthanFourYears" },
                                { label: "> 5 Years", reward: "rewardGreaterthanFiveYears" }
                            ].map((item) => (
                                <div key={item.reward}>
                                    <label htmlFor={item.reward} className={labelClasses}>
                                        Reward for {item.label}
                                    </label>
                                    <input
                                        type="number"
                                        id={item.reward}
                                        name={item.reward}
                                        value={airdropFormData[item.reward as keyof typeof airdropFormData]}
                                        onChange={handleOnChange}
                                        className={inputClasses}
                                    />
                                    {errors?.[item.reward] && (
                                        <p className={errorClasses}>{errors[item.reward]}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Recipients Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-400" />
                                Number of Recipients
                            </h2>

                            {[
                                { label: "< 1 Year", recipient: "totalRecipientLessthanOneYear" },
                                { label: "> 1 Year", recipient: "totalRecipientGreaterthanOneYear" },
                                { label: "> 2 Years", recipient: "totalRecipientGreaterthanTwoYears" },
                                { label: "> 3 Years", recipient: "totalRecipientGreaterthanThreeYears" },
                                { label: "> 4 Years", recipient: "totalRecipientGreaterthanFourYears" },
                                { label: "> 5 Years", recipient: "totalRecipientGreaterthanFiveYears" }
                            ].map((item) => (
                                <div key={item.recipient}>
                                    <label htmlFor={item.recipient} className={labelClasses}>
                                        Recipients for {item.label}
                                    </label>
                                    <input
                                        type="number"
                                        id={item.recipient}
                                        name={item.recipient}
                                        value={airdropFormData[item.recipient as keyof typeof airdropFormData]}
                                        onChange={handleOnChange}
                                        className={inputClasses}
                                    />
                                    {errors?.[item.recipient] && (
                                        <p className={errorClasses}>{errors[item.recipient]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full transition duration-300 flex items-center justify-center gap-2 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating Airdrop...
                            </>
                        ) : (
                            <>
                                <FaParachuteBox className="w-5 h-5" />
                                Create Airdrop
                            </>
                        )}
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
}