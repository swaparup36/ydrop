"use client";

import React, { useEffect, useState } from 'react';
import { Youtube } from 'lucide-react';
import { FaParachuteBox } from "react-icons/fa6";
import { motion } from 'framer-motion';
import Image from 'next/image';
import Button from './components/ui/Button';
import { useRouter } from 'next/navigation';
import FeaturedCreatorCard from './components/FeaturedCreatorCard';
import axios from 'axios';
import { featuredCreatorsType } from './lib/types';

function Home() {
    const router = useRouter();

    const [featuredCreators, setFeaturedCreators] = useState<featuredCreatorsType[]>([]);
    const [followings, setFollowings] = useState<string[]>([]);

    const fadeIn = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };

    const staggerChildren = {
      visible: {
        transition: {
          staggerChildren: 0.1
        }
      }
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

    const getFeaturedCreators = async () => {
      try {
        const response = await axios.get("/api/user/getYoutubersWithAirdrop");
        console.log("Featured creators response: ", response.data);
        if (!response.data.success) {
          return console.log("Unable to get featured creators: ", response.data.message);
        }
        const topFeaturedObjs = response.data.featuredObjs.slice(0, 4);
        setFeaturedCreators(topFeaturedObjs);
      } catch (error) {
        console.log("Can not get featured creators: ", error);
      }
    }

    useEffect(() => {
      getFollowings();
      getFeaturedCreators();
    }, []);

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0817] to-[#1A1033] text-white overflow-hidden">
        {/* Hero Section */}
        <div className="container mx-auto px-14 pt-20 pb-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
            >
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
                variants={fadeIn}
              >
                Reward Your Most Loyal
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> Followers </span>
                with Crypto
              </motion.h1>
              
              <motion.p 
                className="text-gray-300 text-lg"
                variants={fadeIn}
              >
                Create exclusive airdrops for your community based on their engagement. 
                Connect your social accounts and start rewarding your true supporters with 
                Solana tokens and NFTs.
              </motion.p>

              <motion.div 
                className="flex flex-wrap gap-4"
                variants={fadeIn}
              >
                <Button variant='primary' onClick={() => router.push('/create-airdrop')}>
                  Create Airdrop
                  <FaParachuteBox className="w-5 h-5" />
                </Button>
                <Button variant='secondary' onClick={() => router.push('/explore')}>
                  Explore Drops
                </Button>
              </motion.div>

              <motion.div 
                className="flex flex-wrap items-center gap-6 pt-4"
                variants={fadeIn}
              >
                <div className="flex items-center gap-2">
                  <Youtube className="w-6 h-6 text-purple-400" />
                  <span className="text-gray-300">YouTube Creators</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-pink-600/30 rounded-full blur-3xl"></div>
              <motion.div 
                className="relative bg-gradient-to-br from-purple-900/40 to-transparent p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                      key={i}
                      className="bg-gradient-to-br from-purple-500/10 to-transparent p-4 rounded-xl border border-purple-500/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className='h-40 object-cover rounded-lg flex justify-center items-center'>
                        <Image 
                          src={`/images/hero-img-${i}.jpg`}
                          alt="NFT Preview"
                          className="w-52 h-40"
                          width={100}
                          height={100}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-16 pb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="space-y-12"
          >
            <div className="flex justify-between items-center">
              <motion.div variants={fadeIn} className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold">Joined Creators</h2>
                <p className="text-gray-400">Watch And Follow Celebrities To Get Updated When they Launch an Airdrop</p>
              </motion.div>
              <motion.button
                variants={fadeIn}
                className="hidden md:block px-6 py-2 rounded-full border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
              </motion.button>
            </div>

            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerChildren}
            >
              {
                featuredCreators.length > 0 ? (
                  featuredCreators.map((featuredCreator, index) => (
                    <FeaturedCreatorCard key={index} featuredCreator={featuredCreator} followings={followings} />
                  ))
                ) : (
                  <p>No Creators</p>
                )
              }
            </motion.div>

            <motion.button
              variants={fadeIn}
              className="md:hidden w-full px-6 py-2 rounded-full border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                router.push('/creators');
              }}
            >
              View All
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
}

export default Home;