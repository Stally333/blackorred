'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface CardProps {
  color: 'black' | 'red' | null;
  isRevealed: boolean;
  isDrawing: boolean;
  suit?: string;
  value?: string;
  deckCount?: number;
}

export default function Card({ color, isRevealed, isDrawing, suit, value, deckCount = 1 }: CardProps) {
  // Card stacking effect for multiple decks
  const deckStack = Array.from({ length: Math.min(deckCount, 3) }, (_, i) => i);
  
  return (
    <motion.div 
      className="relative w-[280px] h-[380px] rounded-xl overflow-hidden"
      initial={{ rotateY: 0 }}
      exit={{ rotateY: 90 }}
      transition={{ duration: 0.3, ease: "easeIn" }}
    >
      {/* Deck stack effect */}
      {deckStack.map((i) => (
        <div
          key={`deck-${i}`}
          className="absolute"
          style={{
            transform: `translateY(${i * -2}px) translateX(${i * 2}px)`,
            zIndex: -i,
            opacity: isDrawing ? 0 : 0.5
          }}
        >
          <div className="w-64 h-96 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-white/10 shadow-xl" />
        </div>
      ))}

      <AnimatePresence mode="wait">
        {!isRevealed ? (
          // Back of card
          <motion.div
            key="back"
            initial={{ rotateY: 0 }}
            exit={{ rotateY: 90 }}
            transition={{ duration: 0.3, ease: "easeIn" }}
            className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-white/10 shadow-xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {isDrawing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-4xl"
                >
                  🎴
                </motion.div>
              ) : (
                <div className="w-full h-full p-4">
                  <div className="w-full h-full border-2 border-white/20 rounded-lg flex items-center justify-center">
                    <div className="text-4xl font-serif text-white/20">♠♣♥♦</div>
                  </div>
                  {deckCount > 1 && (
                    <div className="absolute bottom-2 right-2 bg-white/10 rounded-full px-2 py-1 text-xs text-white/60">
                      x{deckCount}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          // Front of card
          <motion.div
            key="front"
            initial={{ rotateY: -90 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
            className="absolute inset-0 bg-white rounded-xl border border-white/20 shadow-xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className={`absolute inset-0 p-8 ${
              color === 'black' ? 'text-black' : 'text-red-600'
            }`}>
              {/* Top left */}
              <motion.div 
                className="text-4xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {value}
                <div className="text-5xl">{suit}</div>
              </motion.div>
              
              {/* Center */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-[11rem] font-serif">{suit}</span>
              </motion.div>
              
              {/* Bottom right (inverted) */}
              <motion.div 
                className="absolute bottom-8 right-8 text-4xl font-bold rotate-180"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {value}
                <div className="text-5xl">{suit}</div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 