'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type: 'win' | 'loss';
  amount: number;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, amount, isVisible, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50"
        >
          <div 
            className={`rounded-lg shadow-xl p-4 flex flex-col items-center backdrop-blur-md ${
              type === 'win' 
                ? 'bg-emerald-600/90 text-white border border-emerald-500/50' 
                : 'bg-red-600/90 text-white border border-red-500/50'
            }`}
            style={{
              boxShadow: type === 'win' 
                ? '0 0 20px rgba(16, 185, 129, 0.2)' 
                : '0 0 20px rgba(239, 68, 68, 0.2)'
            }}
          >
            <div className="text-3xl mb-2">
              {type === 'win' ? '🎉' : '💔'}
            </div>
            <div className="text-center">
              <div className="font-medium text-lg mb-1">{message}</div>
              <div className="text-2xl font-bold">
                {type === 'win' ? '+' : '-'}{amount} SOL
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 