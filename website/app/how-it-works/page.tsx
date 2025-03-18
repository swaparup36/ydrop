'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Coins, Users, Gift, ArrowRight, CheckCircle2, Sparkles, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const steps = [
    {
      icon: <Youtube className="w-8 h-8" />,
      title: "Connect Your Channel",
      description: "Link your YouTube channel to identify your loyal subscribers and members"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Define Your Audience",
      description: "Set criteria for rewards based on subscription duration or membership status"
    },
    {
      icon: <Coins className="w-8 h-8" />,
      title: "Configure Rewards",
      description: "Choose tokens and set reward amounts for different subscriber tiers"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Launch Airdrop",
      description: "Deploy your airdrop and let your community claim their rewards"
    }
  ];

  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Grow Your Community",
      description: "Incentivize long-term engagement and reward loyal followers"
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "Token Distribution",
      description: "Easily distribute tokens to thousands of followers automatically"
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "Verified Claims",
      description: "Ensure only eligible subscribers can claim rewards"
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Secure Transactions",
      description: "All transactions are secured by Solana blockchain"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0817] to-[#1A1033] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-20 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="text-center space-y-6 max-w-2xl mx-auto"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold leading-tight"
            >
              How
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> Ydrop </span>
              Works
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              className="text-gray-300 text-lg"
            >
              Reward your most loyal YouTube subscribers and members with crypto tokens in just a few simple steps
            </motion.p>
            <motion.div 
              variants={fadeIn}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link
                href="/create-airdrop"
                className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-medium flex items-center gap-2 transition duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Create Your First Airdrop
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid md:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-900/40 to-transparent p-6 rounded-2xl backdrop-blur-sm border border-purple-500/20 h-full">
                <div className="text-purple-400 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-purple-500/50" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="space-y-12"
        >
          <motion.div 
            variants={fadeIn}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Benefits of Using Ydrop</h2>
            <p className="text-gray-400">Create meaningful connections with your community through token rewards</p>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-900/40 to-transparent p-6 rounded-2xl backdrop-blur-sm border border-purple-500/20"
              >
                <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-purple-400">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-gradient-to-br from-purple-900/40 to-transparent p-12 rounded-3xl backdrop-blur-sm border border-purple-500/20 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Reward Your Community?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Start creating your first airdrop today and build stronger connections with your YouTube community through token rewards
          </p>
          <Link 
            href="/create-airdrop"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-medium transition duration-300"
          >
            <Sparkles className="w-5 h-5" />
            Create Airdrop Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
}