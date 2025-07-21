"use client";
import { motion } from "framer-motion";
import React from "react";

export const LoaderOne = () => {
  const transition = (x: number) => {
    return {
      duration: 1,
      repeat: Infinity,
      repeatType: "loop" as const,
      delay: x * 0.2,
      ease: "easeInOut" as const,
    };
  };
  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        initial={{
          y: 0,
        }}
        animate={{
          y: [0, 8, 0],
        }}
        transition={transition(0)}
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: '#8b6d4f' }}
      />
      <motion.div
        initial={{
          y: 0,
        }}
        animate={{
          y: [0, 8, 0],
        }}
        transition={transition(1)}
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: '#8b6d4f' }}
      />
      <motion.div
        initial={{
          y: 0,
        }}
        animate={{
          y: [0, 8, 0],
        }}
        transition={transition(2)}
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: '#8b6d4f' }}
      />
    </div>
  );
};

export const LoaderTwo = () => {
  const transition = (x: number) => {
    return {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const,
      delay: x * 0.2,
      ease: "easeInOut" as const,
    };
  };
  return (
    <div className="flex items-center">
      <motion.div
        transition={transition(0)}
        initial={{
          x: 0,
        }}
        animate={{
          x: [0, 20, 0],
        }}
        className="h-4 w-4 rounded-full bg-neutral-200 shadow-md dark:bg-neutral-500"
      />
      <motion.div
        initial={{
          x: 0,
        }}
        animate={{
          x: [0, 20, 0],
        }}
        transition={transition(0.4)}
        className="h-4 w-4 -translate-x-2 rounded-full bg-neutral-200 shadow-md dark:bg-neutral-500"
      />
      <motion.div
        initial={{
          x: 0,
        }}
        animate={{
          x: [0, 20, 0],
        }}
        transition={transition(0.8)}
        className="h-4 w-4 -translate-x-4 rounded-full bg-neutral-200 shadow-md dark:bg-neutral-500"
      />
    </div>
  );
};

export const LoaderFour = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="relative font-bold text-black dark:text-white" style={{ perspective: '1000px' }}>
      <motion.span
        animate={{
          scaleX: [1, 1.5, 1],
        }}
        transition={{
          duration: 0.05,
          repeat: Infinity,
          repeatType: "reverse" as const,
          repeatDelay: 2,
          ease: "linear" as const,
          times: [0, 0.2, 0.5, 0.8, 1],
        }}
        style={{
          transformOrigin: "center",
        }}
        className="relative z-20 inline-block [transform:skewX(0deg)] animate-pulse"
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-green-400/50 blur-[0.5px] dark:text-green-400"
        animate={{
          x: [-2, 4, -3, 1.5, -2],
          y: [-2, 4, -3, 1.5, -2],
          opacity: [0.3, 0.9, 0.4, 0.8, 0.3],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "linear" as const,
          times: [0, 0.2, 0.5, 0.8, 1],
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-purple-600/50 dark:text-purple-400"
        animate={{
          x: [0, 1, -1.5, 1.5, -1, 0],
          y: [0, -1, 1.5, -0.5, 0],
          opacity: [0.4, 0.8, 0.3, 0.9, 0.4],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "linear" as const,
          times: [0, 0.3, 0.6, 0.8, 1],
        }}
      >
        {text}
      </motion.span>
    </div>
  );
};

export const LoaderFive = ({ text }: { text: string }) => {
    return (
      <div className="font-sans font-bold text-black">
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
              color: ["#715a44", "#a8845f"],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "loop" as const,
              delay: i * 0.05,
              ease: "easeInOut" as const,
              repeatDelay: 2,
            }}
            style={{
              textShadow: '0 0 1px currentColor',
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    );
  };