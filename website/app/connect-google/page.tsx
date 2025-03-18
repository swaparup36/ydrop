"use client"

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube } from 'lucide-react';
import Link from 'next/link';
import SignIn from '../components/SignIn';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const authenticate = async () => {
    try {
      const authRes = await axios.get('/api/auth/authenticate');
      if(authRes.data.success) {
        router.push('/');
      }
    } catch (error) {
      console.log("unable to authenticate user: ", error);
    }
  }

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0817] to-[#1A1033] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl"></div>
      </div>
      
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
        className="max-w-md w-full space-y-8 bg-gradient-to-br from-purple-900/40 to-transparent p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20 relative"
      >
        <motion.div variants={fadeIn} className="text-center">
          <Link href="/" className="inline-block">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to Ydrop</h2>
          </Link>
          <p className="text-gray-400">Connect your Google account to start creating airdrops for your followers</p>
        </motion.div>

        <motion.div variants={fadeIn} className="space-y-6">
          <div className="bg-gradient-to-br from-purple-500/10 to-transparent p-6 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-4 mb-4">
              <Youtube className="w-8 h-8 text-purple-400" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">YouTube Integration</h3>
                <p className="text-sm text-gray-400">Connect to manage your YouTube community</p>
              </div>
            </div>
            <SignIn />
          </div>
        </motion.div>
        <p className="text-sm text-center text-gray-400">
          By connecting, you agree to our{' '}
          <Link href="#" className="text-purple-400 hover:text-purple-300 transition">Terms of Service</Link>
          {' '}and{' '}
          <Link href="#" className="text-purple-400 hover:text-purple-300 transition">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  );
}