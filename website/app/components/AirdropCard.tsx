"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Timer, Users } from 'lucide-react';
import { Airdrop } from "@/app/lib/types";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function AirdropCard(airdrop: Airdrop) {
  const router = useRouter();

  // Calculate total recipients
  const totalRecipients = 
    airdrop.totalRecipientLessthanOneYear +
    airdrop.totalRecipientGreaterthanOneYear +
    airdrop.totalRecipientGreaterthanTwoYears +
    airdrop.totalRecipientGreaterthanThreeYears +
    airdrop.totalRecipientGreaterthanFourYears +
    airdrop.totalRecipientGreaterthanFiveYears;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-purple-900/40 to-transparent p-6 rounded-2xl backdrop-blur-sm border border-purple-500/20 overflow-hidden relative group"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Cover Picture */}
      <div className='w-full mb-4 rounded-lg relative h-52'>
        <Image
          src={airdrop.coverPicture}
          alt={airdrop.title}
          className="w-full h-full object-cover rounded-lg"
          height={200}
          width={200}
        />
      </div>

      {/* Content */}
      <div className="relative space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">{airdrop.title}</h2>
            <p className="text-gray-400 text-sm line-clamp-2">{airdrop.description}</p>
          </div>
          <div className="bg-purple-500/20 p-2 rounded-full">
            <Timer className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>{totalRecipients} eligible recipients</span>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push(`/explore/${airdrop.id}`)}
          className={`w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition duration-300 flex items-center justify-center gap-2`}
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
}

export default AirdropCard;