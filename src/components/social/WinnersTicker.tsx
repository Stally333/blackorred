'use client';
import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Winner {
  user: string;
  amount: number;
  timestamp: Date;
}

export default function WinnersTicker() {
  // Create more mock data
  const baseWinners: Winner[] = [
    { user: 'CryptoKing', amount: 100, timestamp: new Date() },
    { user: 'SolanaWhale', amount: 250, timestamp: new Date() },
    { user: 'LuckyPlayer', amount: 50, timestamp: new Date() },
    { user: 'MoonBoy', amount: 175, timestamp: new Date() },
    { user: 'DiamondHands', amount: 420, timestamp: new Date() },
    { user: 'SOLMaster', amount: 300, timestamp: new Date() },
  ];

  // Duplicate the winners array to create a seamless loop
  const [winners, setWinners] = useState([...baseWinners, ...baseWinners]);
  const controls = useAnimationControls();

  // Function to update winners with new random amounts
  const updateWinners = () => {
    const newWinners = baseWinners.map(winner => ({
      ...winner,
      amount: Math.floor(Math.random() * 450) + 50, // Random amount between 50 and 500
      timestamp: new Date()
    }));
    setWinners([...newWinners, ...newWinners]);
  };

  useEffect(() => {
    // Update winners every 20 seconds
    const interval = setInterval(updateWinners, 20000);
    return () => clearInterval(interval);
  }, [updateWinners]);

  // Calculate total width for smooth scrolling
  const containerWidth = winners.length * 200; // Approximate width per winner item

  // Add loading indicator for card draw
  const [isTransacting, setIsTransacting] = useState(false);

  return (
    <div className="fixed top-16 left-0 right-0 bg-gradient-to-r from-emerald-600/90 to-emerald-700/90 backdrop-blur-sm border-b border-white/10 z-20 overflow-hidden">
      <motion.div
        animate={{
          x: [-200, -containerWidth],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="py-1 flex items-center gap-8 text-white whitespace-nowrap text-sm"
      >
        {winners.map((winner, index) => (
          <motion.div
            key={`${winner.user}-${index}`}
            className="flex items-center gap-2"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
          >
            <span className="text-white/60">🎉</span>
            <span className="font-medium">{winner.user}</span>
            <span className="text-emerald-300">won</span>
            <motion.span 
              className="font-bold"
              initial={{ opacity: 0.8, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {winner.amount} SOL
            </motion.span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 