"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import axios from 'axios';
import { featuredCreatorsType } from '../lib/types';
import FeaturedCreatorCard from '../components/FeaturedCreatorCard';

export default function Creators() {
  const [page, setPage] = useState<number>(1);
  const [creators, setCreators] = useState<featuredCreatorsType[]>([]);
  const [followings, setFollowings] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getFollowings = async () => {
    try {
      const response = await axios.get("/api/user/getFollowings");

      console.log("Followings response: ", response.data);

      if(!response.data.success) {
        console.log("Unable to get followings: ", response.data.message);
      }

      setFollowings(response.data.followings);
    } catch (error) {
      console.log(error);
    }
  }

  const getCreators = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/user/getYoutubersWithAirdrop?page${page}&limit=12&search=${searchTerm}`);
      console.log("creators response: ", response.data);
      if (!response.data.success) {
        setIsLoading(false);
        return console.log("Unable to get creators: ", response.data.message);
      }

      setCreators(response.data.featuredObjs);
    } catch (error) {
      console.log("Can not get creators: ", error);
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    getCreators();
    getFollowings();
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
              className="text-4xl md:text-5xl font-bold"
            >
              Discover Amazing
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> Creators </span>
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              className="text-gray-300"
            >
              Follow your favorite content creators and never miss their exclusive airdrops
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search creators..."
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
              getCreators();
            }}
          >
            <Search className="w-4 h-4" />
            Search
          </motion.button>
        </motion.div>

        {/* Featured Creators Section */}
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
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-900/40 to-transparent p-6 rounded-2xl backdrop-blur-sm border border-purple-500/20 animate-pulse"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="aspect-square rounded-lg bg-purple-500/20"></div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-500/20"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-purple-500/20 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-purple-500/20 rounded-full"></div>
                  </div>
                </div>
              ))
            ) : creators.length > 0 ? (
                creators.map((creator) => {
                    return (
                        <FeaturedCreatorCard
                          key={creator.userId}
                          featuredCreator={creator}
                          followings={followings}
                        />
                    );
                })
            ) : (
                <div className="col-span-3 text-center py-10">
                    <p className="text-gray-400">No creators found</p>
                </div>
            )}
          </motion.div>
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