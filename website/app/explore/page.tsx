"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { FaParachuteBox } from "react-icons/fa6";
import AirdropCard from '../components/AirdropCard';
import { Airdrop } from "@/app/lib/types";
import axios from 'axios';
import Link from 'next/link';

export default function Explore() {
  const [page, setPage] = useState<number>(1);
  const [allAirdrops, setAllAirdrops] = useState<Airdrop[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function getAllAirdrops() {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/airdrop/getall?page${page}&limit=12&search=${searchTerm}`);
      console.log("get airdrop response: ", response.data);

      if (!response.data.success) {
        setIsLoading(false);
        return console.log("Can not get airdrops: ", response.data.message);
      }

      setAllAirdrops(response.data.allAirdrops);
    } catch (error) {
      console.log("Can not get airdrops: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllAirdrops();
  }, [page]);

  useEffect(() => {
      const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            setPage((prev) => prev + 1);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0817] to-[#1A1033] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-16 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="text-center space-y-6 max-w-2xl mx-auto"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold"
            >
              Explore Active
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> Airdrops </span>
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              className="text-gray-300"
            >
              Discover and claim exclusive airdrops from your favorite content creators
            </motion.p>

            <motion.div 
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/create-airdrop"
                className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition duration-300 group"
              >
                <FaParachuteBox className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Create Airdrop
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-10 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search airdrops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-purple-900/20 border border-purple-500/20 rounded-full pl-12 pr-4 py-2 focus:outline-none focus:border-purple-500 transition"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2 rounded-full border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition duration-300"
            onClick={() => {
              getAllAirdrops();
            }}
          >
            <Search className="w-4 h-4" />
            Search
          </motion.button>
        </motion.div>

        {/* Airdrops Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {allAirdrops.length > 0 ? (
            allAirdrops.map((airdrop) => (
              <motion.div
                key={airdrop.id}
                variants={fadeIn}
              >
                <AirdropCard {...airdrop} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              variants={fadeIn}
              className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400"
            >
              <div className="bg-purple-900/20 p-8 rounded-full mb-4">
                <FaParachuteBox className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Airdrops Found</h3>
              <p>Be the first to create an airdrop for your community!</p>
            </motion.div>
          )}
        </motion.div>

        {
          isLoading && (
            <div className="text-white flex items-center justify-center">
              <div className="w-4 h-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )
        }

      </div>
    </div>
  );
}