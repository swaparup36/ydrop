"use client";

import React, { ReactNode } from 'react';
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from '@/app/lib/cn';

type ButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant: 'primary' | 'secondary';
}

function Button({ children, className, variant, ...props }: ButtonProps) {
  return (
    <motion.button
        className={cn('px-8 py-3 rounded-full font-medium flex items-center justify-center gap-2', className, {
          'bg-gradient-to-br from-purple-500/50 to-transparent hover:bg-gradient-to-br hover:from-purple-800/90 hover:to-transparent transition-colors duration-300': variant === 'primary',
          'border border-purple-500 hover:bg-purple-500/10 transition duration-300': variant === 'secondary'
        })}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
    >
        {children}
    </motion.button>
  )
}

export default Button