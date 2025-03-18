"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Timer, Users, AlertCircle, Youtube, Coins, ArrowRight, Clock } from 'lucide-react';
import axios from 'axios';
import { Airdrop } from '@/app/lib/types';
import { useParams } from 'next/navigation';
import { createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey, Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';

const connection = new Connection(clusterApiUrl("devnet"));

export default function AirdropDetails() {
  const { airdropId } = useParams();
  const wallet = useWallet();
  const [airdrop, setAirdrop] = useState<Airdrop | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [eligibilityMsg, setEligibilityMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimed, setIsClaimed] = useState<boolean>(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    fetchAirdropDetails();
  }, [airdropId]);

  async function fetchAirdropDetails() {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/airdrop/getDetails`, { airdropId });
      if (response.data.success) {
        setAirdrop(response.data.airdrop);
      }
    } catch (error) {
      console.error('Error fetching airdrop details:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function checkEligibility() {
    try {
      setIsChecking(true);
      const response = await axios.post('/api/airdrop/getamount', { airdropId: airdropId });

      if (!response.data.success) {
        setEligibilityMsg(response.data.message);
        return;
      }

      setAmount(response.data.amount);
    } catch (error) {
      console.error('Error checking eligibility:', error);
      setEligibilityMsg('Error checking eligibility. Please try again.');
    } finally {
      setIsChecking(false);
    }
  }

  async function claimAirdrop(airdropId: string, tokenMint: string) {
      try {
        setIsClaiming(true);
        if (!wallet.publicKey) return console.log("wallet is not connected");
        const mint = new PublicKey(tokenMint);
        const associatedTokenAc = getAssociatedTokenAddressSync(
          mint,
          wallet.publicKey,
          false,
          TOKEN_PROGRAM_ID
        );
        try {
          await getAccount(connection, associatedTokenAc);
        } catch (error) {
          try {
            console.log("ATA Does not exist: ", error);
            console.log("Creating ATA for reciever...");
            const ataCreateTx = new Transaction().add(
              createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                associatedTokenAc,
                wallet.publicKey,
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
          } catch (error) {
            return console.log("can't create ATA for user: ", error);
          }
        }
  
        const claimResponse = await axios.post('/api/airdrop/claim', { airdropId: airdropId, amount: amount, userPublicKey: wallet.publicKey });
  
        if (!claimResponse.data.success) {
          console.log("Can not claim airdrop: ", claimResponse.data.message);
          return alert(`error: ${claimResponse.data.message}`);
        }
  
        alert("airdrop claimed");
        setIsClaimed(true);
      } catch (error) {
        console.log("Can not claim airdrop: ", error);
      } finally {
        setIsClaiming(false);
      }
    }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0817] to-[#1A1033] text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!airdrop) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0817] to-[#1A1033] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Airdrop Not Found</h2>
        </div>
      </div>
    );
  }

  const totalRecipients = 
    airdrop.totalRecipientLessthanOneYear +
    airdrop.totalRecipientGreaterthanOneYear +
    airdrop.totalRecipientGreaterthanTwoYears +
    airdrop.totalRecipientGreaterthanThreeYears +
    airdrop.totalRecipientGreaterthanFourYears +
    airdrop.totalRecipientGreaterthanFiveYears;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0817] to-[#1A1033] text-white">
      <div className="relative overflow-hairdropIdden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial="hairdropIdden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="max-w-4xl mx-auto"
          >
            {/* Airdrop Header */}
            <motion.div
              variants={fadeIn}
              className="bg-gradient-to-br from-purple-900/40 to-transparent p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20 mb-8"
            >
                <div className="flex items-center justify-between w-full my-4">
                    <Image
                        src={airdrop.coverPicture}
                        alt={airdrop.title}
                        className='w-full h-full rounded-lg'
                        width={500}
                        height={500}
                    />
                </div>
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{airdrop.title}</h1>
                        <p className="text-gray-400">{airdrop.description}</p>
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded-full">
                        <Timer className="w-8 h-8 text-purple-400" />
                    </div>
                </div>

                <div className="grairdropId grairdropId-cols-1 md:grairdropId-cols-3 gap-6">
                    <div className="flex items-center gap-3 my-3">
                        <div className="bg-purple-500/20 p-2 rounded-full">
                            <Users className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Recipients</p>
                            <p className="font-semibold">{totalRecipients}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 my-3">
                        <div className="bg-purple-500/20 p-2 rounded-full">
                            <Youtube className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Based On</p>
                            <p className="font-semibold capitalize">{airdrop.basedOn}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 my-3">
                        <div className="bg-purple-500/20 p-2 rounded-full">
                            <Clock className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Start Date</p>
                            <p className="font-semibold">{new Date(airdrop.startDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Reward Tiers */}
            <motion.div
              variants={fadeIn}
              className="bg-gradient-to-br from-purple-900/40 to-transparent p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20 mb-8"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Coins className="w-5 h-5 text-purple-400" />
                Reward Tiers
              </h2>

              <div className="grairdropId gap-4">
                {[
                  { label: "Less than 1 Year", reward: airdrop.rewardLessthanOneYear, recipients: airdrop.totalRecipientLessthanOneYear },
                  { label: "1-2 Years", reward: airdrop.rewardGreaterthanOneYear, recipients: airdrop.totalRecipientGreaterthanOneYear },
                  { label: "2-3 Years", reward: airdrop.rewardGreaterthanTwoYears, recipients: airdrop.totalRecipientGreaterthanTwoYears },
                  { label: "3-4 Years", reward: airdrop.rewardGreaterthanThreeYears, recipients: airdrop.totalRecipientGreaterthanThreeYears },
                  { label: "4-5 Years", reward: airdrop.rewardGreaterthanFourYears, recipients: airdrop.totalRecipientGreaterthanFourYears },
                  { label: "5+ Years", reward: airdrop.rewardGreaterthanFiveYears, recipients: airdrop.totalRecipientGreaterthanFiveYears }
                ].map((tier, index) => (
                  <div
                    key={index}
                    className="bg-purple-500/10 rounded-xl p-4 flex items-center justify-between my-3"
                  >
                    <div>
                      <h3 className="font-semibold">{tier.label}</h3>
                      <p className="text-sm text-gray-400">{tier.recipients} recipients</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-400">{tier.reward / (10**airdrop.tokenDecimal)} {airdrop.tokenName} tokens</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Eligibility Check & Claim */}
            <motion.div
              variants={fadeIn}
              className="bg-gradient-to-br from-purple-900/40 to-transparent p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20"
            >
              <h2 className="text-xl font-bold mb-6">Check Your Eligibility</h2>

              {eligibilityMsg && (
                <div className="flex items-center gap-2 text-yellow-400 mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <p>{eligibilityMsg}</p>
                </div>
              )}

              {amount && (
                <div className="flex items-center gap-2 text-green-400 mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <p>You are eligible for {amount/(10**airdrop.tokenDecimal)} tokens!</p>
                </div>
              )}

              {
                isClaimed ? (
                    <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={true}
                          className="w-full cursor-not-allowed bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full transition duration-300 flex items-center justify-center gap-2"
                        >
                          Already Claimed
                        </motion.button>
                ) : (
                    !amount ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={checkEligibility}
                          disabled={isChecking}
                          className={`w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full transition duration-300 flex items-center justify-center gap-2 ${isChecking ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                          {isChecking ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Checking Eligibility...
                            </>
                          ) : (
                            <>
                              Check Eligibility
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => claimAirdrop(airdrop.id, airdrop.tokenMint)}
                          disabled={isClaiming}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full transition duration-300 flex items-center justify-center gap-2"
                        >
                          {isClaiming ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Claiming Airdrop...
                            </>
                          ) : (
                            <>
                              <Coins className="w-5 h-5" />
                              Claim Airdrop
                            </>
                          )}
                        </motion.button>
                      )
                )
              }
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}