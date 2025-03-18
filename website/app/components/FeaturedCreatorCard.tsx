"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { featuredCreatorsType } from "../lib/types";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import axios from "axios";

function FeaturedCreatorCard({
  featuredCreator,
  followings,
}: {
  featuredCreator: featuredCreatorsType;
  followings: string[];
}) {
  const [isFollowed, setIsFollowed] = useState<boolean>(
    followings.includes(featuredCreator.userId)
  );

  const handleFollowUnfollowCreator = async () => {
    try {
      const response = await axios.post("/api/user/follow-unfollow", {
        creatorId: featuredCreator.userId,
      });

      console.log("Follow-unfollow response: ", response.data);

      if (!response.data.success) {
        return console.log("can not follow/unfollow: ", response.data.message);
      }

      setIsFollowed(!isFollowed);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-transparent p-6 rounded-2xl backdrop-blur-sm border border-purple-500/20">
      <div className="space-y-4">
        {
          featuredCreator.airdropImages.length >= 2 ? (
            <div className="grid grid-cols-2 gap-2">
              {featuredCreator.airdropImages.map((img, imgIndex) => (
                <motion.div
                  key={imgIndex}
                  className="aspect-square rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={img}
                    alt="NFT"
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {featuredCreator.airdropImages.map((img, imgIndex) => (
                <motion.div
                  key={imgIndex}
                  className="aspect-square rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={img}
                    alt="NFT"
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                </motion.div>
              ))}
            </div>
          )
        }
        <div className="flex items-center gap-3">
          <Image
            src={featuredCreator.image}
            alt={featuredCreator.name}
            className="w-12 h-12 rounded-full"
            width={100}
            height={100}
          />
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-semibold">{featuredCreator.name}</h3>
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        </div>
        <motion.button
          className="w-full py-2 rounded-full border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFollowUnfollowCreator}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </motion.button>
      </div>
    </div>
  );
}

export default FeaturedCreatorCard;
