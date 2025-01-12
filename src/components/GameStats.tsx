import { motion } from 'framer-motion';

interface GameStatsProps {
  lastResults: ('black' | 'red')[];
  showResults: boolean;
}

export default function GameStats({ lastResults, showResults }: GameStatsProps) {
  return (
    <motion.div 
      className="flex gap-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {lastResults.length > 0 ? (
        lastResults.map((result, index) => (
          <motion.div
            key={index}
            className={`w-5 h-5 rounded-lg ${
              result === 'black' 
                ? 'bg-black ring-1 ring-white/20' 
                : 'bg-red-600 ring-1 ring-white/20'
            }`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          />
        ))
      ) : (
        <div className="text-white/40 text-sm px-2">No results yet</div>
      )}
    </motion.div>
  );
} 