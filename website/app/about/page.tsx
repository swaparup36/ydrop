"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Heart, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Connect with YouTube creators and communities worldwide through our platform"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Built on Solana blockchain with enterprise-grade security measures"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Community First",
      description: "Designed to strengthen the bond between creators and their loyal followers"
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
            className="text-center space-y-6 max-w-3xl mx-auto"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold leading-tight"
            >
              Empowering Creators to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> Reward </span>
              Their Community
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              className="text-gray-300 text-lg"
            >
              Ydrop is revolutionizing how YouTube creators connect with their audience through blockchain technology and token rewards
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
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
          className="space-y-16"
        >
          <motion.div 
            variants={fadeIn}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose Ydrop</h2>
            <p className="text-gray-400">Built with creators in mind, our platform offers everything you need to reward your community</p>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-purple-900/40 to-transparent p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20"
              >
                <div className="text-purple-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
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
          <h2 className="text-3xl font-bold mb-4">Join the Revolution</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Be part of the future of creator-community relationships. Start rewarding your loyal followers today.
          </p>
          <Link
            href="/create-airdrop"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-medium transition duration-300"
          >
            <Sparkles className="w-5 h-5" />
            Get Started Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
}