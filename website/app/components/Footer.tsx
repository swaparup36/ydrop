"use client";

import React from "react";
import { motion } from "framer-motion";
import { Coins, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

function Footer() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const staggerChildren = {
        visible: {
        transition: {
            staggerChildren: 0.1,
        },
        },
    };

    return (
        <footer className="md:px-16 px-4 bg-gradient-to-b from-[#0F0817] to-[#1A1033]">
            <div className="container mx-auto px-4 py-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerChildren}
                    className="grid md:grid-cols-4 gap-12 md:gap-8 pb-5"
                >
                    {/* Brand Section */}
                    <motion.div variants={fadeIn} className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Coins className="w-8 h-8 text-purple-500" />
                            <span className="text-2xl font-bold">Ydrop</span>
                        </div>
                        <p className="text-gray-400 max-w-[80%] md:w-full">
                            Ydrop is the {"world's"} leading platform where creators can
                            reward their most loyal followers with crypto tokens and NFTs.
                        </p>
                        <div className="flex gap-4">
                        <motion.a
                            href="#"
                            className="text-purple-400 hover:text-purple-300 transition"
                            whileHover={{ scale: 1.1 }}
                        >
                            <Youtube className="w-6 h-6" />
                        </motion.a>
                        <motion.a
                            href="#"
                            className="text-purple-400 hover:text-purple-300 transition"
                            whileHover={{ scale: 1.1 }}
                        >
                            <Twitter className="w-6 h-6" />
                        </motion.a>
                        <motion.a
                            href="#"
                            className="text-purple-400 hover:text-purple-300 transition"
                            whileHover={{ scale: 1.1 }}
                        >
                            <Facebook className="w-6 h-6" />
                        </motion.a>
                        <motion.a
                            href="#"
                            className="text-purple-400 hover:text-purple-300 transition"
                            whileHover={{ scale: 1.1 }}
                        >
                            <Instagram className="w-6 h-6" />
                        </motion.a>
                        </div>
                    </motion.div>

                    {/* About Links */}
                    <motion.div variants={fadeIn} className="space-y-6">
                        <h3 className="text-lg font-semibold">About</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-400 hover:text-purple-400 transition"
                                >
                                    About NFT
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-400 hover:text-purple-400 transition"
                                >
                                    Live Airdrops
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-400 hover:text-purple-400 transition"
                                >
                                    NFT Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-400 hover:text-purple-400 transition"
                                >
                                    Activity
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Support Links */}
                    <motion.div variants={fadeIn} className="space-y-6">
                        <h3 className="text-lg font-semibold">Support</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-400 hover:text-purple-400 transition"
                                >
                                Help & Support
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-400 hover:text-purple-400 transition"
                                >
                                Item Details
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-400 hover:text-purple-400 transition"
                                >
                                Author Profile
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-gray-400 hover:text-purple-400 transition"
                                >
                                Collection
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Newsletter */}
                    <motion.div variants={fadeIn} className="space-y-6">
                        <h3 className="text-lg font-semibold">Newsletter</h3>
                        <p className="text-gray-400">
                            Subscribe to our newsletter for the latest updates
                        </p>
                        <div className="flex gap-2 flex-col md:flex-row">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 my-2 bg-purple-900/20 border border-purple-500/20 rounded-full px-4 py-2 focus:outline-none focus:border-purple-500 transition"
                            />
                            <motion.button
                                className="bg-purple-600 my-2 hover:bg-purple-700 px-6 py-2 rounded-full transition duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Copyright */}
                <motion.div
                    variants={fadeIn}
                    className="mt-2 pt-8 border-t border-purple-500/20 text-center text-gray-400"
                >
                <p>© 2025 Swaparup Mukherjee. All rights reserved.</p>
                    </motion.div>
            </div>
        </footer>
    );
}

export default Footer;
