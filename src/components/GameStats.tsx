import { motion } from 'framer-motion';

interface GameStatsProps {
  lastResults: ('black' | 'red')[];
}

export default function GameStats({ lastResults }: GameStatsProps) {
  return (
    <motion.div 
      className="flex gap-2 bg-white/5 rounded-lg p-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {lastResults.map((result, index) => (
        <motion.div
          key={index}
          className={`w-4 h-4 rounded-full ${
            result === 'black' ? 'bg-black' : 'bg-red-600'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        />
      ))}
      {lastResults.length === 0 && (
        <div className="text-white/40 text-sm px-2">No results yet</div>
      )}
    </motion.div>
  );
} 