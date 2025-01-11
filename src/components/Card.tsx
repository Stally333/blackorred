import { motion } from 'framer-motion';

interface CardProps {
  color: 'black' | 'red';
  isRevealed: boolean;
  onReveal?: () => void;
}

export default function Card({ color, isRevealed, onReveal }: CardProps) {
  // Add card suits and values
  const blackSuits = ['♠', '♣'];
  const redSuits = ['♥', '♦'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  // Randomly select suit and value when card is created
  const suit = color === 'black' 
    ? blackSuits[Math.floor(Math.random() * blackSuits.length)]
    : redSuits[Math.floor(Math.random() * redSuits.length)];
  const value = values[Math.floor(Math.random() * values.length)];

  return (
    <motion.div
      className="relative w-[250px] h-[350px] cursor-pointer"
      whileHover={{ scale: 1.05 }}
      onClick={onReveal}
    >
      {!isRevealed ? (
        // Card Back
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-white/10 shadow-xl backdrop-blur-sm">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Custom card back design */}
            <div className="w-4/5 h-4/5 border-2 border-white/20 rounded-lg flex items-center justify-center">
              <div className="text-4xl font-serif text-white/20">♠♣♥♦</div>
            </div>
          </div>
        </div>
      ) : (
        // Card Front
        <motion.div 
          initial={{ rotateY: 180 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 0.6 }}
          className={`absolute inset-0 bg-white rounded-xl border border-white/20 shadow-xl p-4`}
        >
          <div className={`flex flex-col h-full ${color === 'black' ? 'text-black' : 'text-red-600'}`}>
            {/* Top left */}
            <div className="text-2xl font-bold">
              {value}
              <div className="text-3xl">{suit}</div>
            </div>
            
            {/* Center */}
            <div className="flex-1 flex items-center justify-center">
              <span className="text-8xl font-serif">{suit}</span>
            </div>
            
            {/* Bottom right (inverted) */}
            <div className="text-2xl font-bold self-end rotate-180">
              {value}
              <div className="text-3xl">{suit}</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 