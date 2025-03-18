"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, LogOutIcon, Menu } from "lucide-react";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { signOut } from 'next-auth/react';
import { MotionLink } from "./ui/MotionLink";
import Image from "next/image";

function Navbar() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isLogged, setIsLogged] = React.useState(false);

    const authenticate = async () => {
        try {
            const authRes = await axios.get('/api/auth/authenticate');
            if(authRes.data.success) {
                setIsLogged(true);
            }
        } catch (error) {
            console.log("unable to authenticate user: ", error);
        }
    }

    useEffect(() => {
        authenticate();
    }, []);

    return (
        <nav className="container mx-auto px-10 py-6 relative">
        <div className="flex items-center justify-between">
            <motion.div
                className="flex cursor-pointer items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => router.push('/')}
            >
                {/* <Coins className="w-8 h-8 text-purple-500" />
                <span className="text-2xl font-bold">Ydrop</span> */}
                <Image src='/images/logo.png' alt="logo" className="w-36 h-full" width={400} height={400} />
            </motion.div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
                <MotionLink
                    href="/how-it-works"
                    className="hover:text-purple-400 transition"
                    whileHover={{ scale: 1.05 }}
                >
                    How It Works
                </MotionLink>
                <MotionLink
                    href="/explore"
                    className="hover:text-purple-400 transition"
                    whileHover={{ scale: 1.05 }}
                >
                    Explore Drops
                </MotionLink>
                <MotionLink
                    href="/creators"
                    className="hover:text-purple-400 transition"
                    whileHover={{ scale: 1.05 }}
                >
                    Creators
                </MotionLink>
                <MotionLink
                    href="/about"
                    className="hover:text-purple-400 transition"
                    whileHover={{ scale: 1.05 }}
                >
                    About
                </MotionLink>
            </div>
            {
                isLogged ? (
                    <div className="flex items-center gap-4">
                        <WalletMultiButton style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '9999px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.5), transparent)',
                            transition: 'background 0.3s',
                            cursor: 'pointer',
                        }} className="hover:bg-gradient-to-br hover:from-purple-800/90 hover:to-transparent" />
                        <motion.span whileHover={{ scale: 1.05 }}>
                            <LogOutIcon className="cursor-pointer" onClick={() => signOut()} />
                        </motion.span>
                    </div>
                ) : (
                    <Button variant="primary" onClick={() => router.push('/connect-google')}>
                        Connect Google Account
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                )
            }
        </div>

        {/* Mobile Menu */}
        <motion.div
            className={`md:hidden absolute top-full left-0 right-0 bg-[#1A1033] p-4 space-y-4 ${
            isMenuOpen ? "block" : "hidden"
            }`}
            initial="hidden"
            animate={isMenuOpen ? "visible" : "hidden"}
            variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: -20 },
            }}
        >
            <a href="/how-it-works" className="block hover:text-purple-400 transition">
                How It Works
            </a>
            <a href="#" className="block hover:text-purple-400 transition">
                Explore Drops
            </a>
            <a href="/creators" className="block hover:text-purple-400 transition">
                Creators
            </a>
            <a href="/about" className="block hover:text-purple-400 transition">
                About
            </a>
            <Button variant="primary" onClick={() => router.push('/connect-google')}>
                Connect Google Account
                <ChevronRight className="w-4 h-4" />
            </Button>
        </motion.div>
        </nav>
    );
}

export default Navbar;
