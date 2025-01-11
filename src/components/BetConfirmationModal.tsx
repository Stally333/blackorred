'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface BetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (multiplier?: number, autoBet?: boolean) => void;
  amount: number;
  selectedColor: 'black' | 'red' | null;
}

export default function BetConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  amount,
  selectedColor: initialColor 
}: BetConfirmationModalProps) {
  const [customAmount, setCustomAmount] = useState<number>(amount);
  const [autoBetCount, setAutoBetCount] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<'black' | 'red' | null>(initialColor);

  const presetAmounts = [
    { label: '0.1 SOL', value: 0.1 },
    { label: '0.5 SOL', value: 0.5 },
    { label: '1 SOL', value: 1 },
    { label: '2 SOL', value: 2 },
  ];

  const autoBetOptions = [
    { label: 'Single Bet', value: 0 },
    { label: '5 Rounds', value: 5 },
    { label: '10 Rounds', value: 10 },
    { label: '20 Rounds', value: 20 },
  ];

  const handleConfirm = () => {
    if (!selectedColor) return;
    onConfirm(customAmount, autoBetCount > 0);
  };

  const handleAmountChange = (delta: number) => {
    const newAmount = Math.max(0, customAmount + delta);
    setCustomAmount(Number(newAmount.toFixed(3)));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900/95 backdrop-blur-md p-6 rounded-xl border border-white/20 w-full max-w-sm shadow-xl"
          >
            <h3 className="text-xl font-bold text-white mb-4">Confirm Your Bet</h3>
            <div className="space-y-4">
              {/* Bet Amount with Preset Options */}
              <div className="bg-black/40 p-3 rounded-lg space-y-2">
                <div className="text-sm text-white/60">Amount</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAmountChange(-0.1)}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-xl font-bold transition-all"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    className="flex-1 bg-black/20 rounded-lg px-3 py-3 text-white text-center text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    step="0.1"
                  />
                  <button
                    onClick={() => handleAmountChange(0.1)}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-xl font-bold transition-all"
                  >
                    +
                  </button>
                  <span className="text-white font-bold w-14">SOL</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setCustomAmount(preset.value)}
                      className={`px-2 py-1.5 rounded ${
                        customAmount === preset.value
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      } transition-all text-sm font-medium`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="bg-black/40 p-3 rounded-lg space-y-2">
                <div className="text-sm text-white/60">Color Selected</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedColor('black')}
                    className={`px-4 py-2 rounded-lg ${
                      selectedColor === 'black'
                        ? 'bg-black text-white ring-2 ring-white/20'
                        : 'bg-black/50 text-white/60'
                    }`}
                  >
                    Black
                  </button>
                  <button
                    onClick={() => setSelectedColor('red')}
                    className={`px-4 py-2 rounded-lg ${
                      selectedColor === 'red'
                        ? 'bg-red-600 text-white ring-2 ring-white/20'
                        : 'bg-red-600/50 text-white/60'
                    }`}
                  >
                    Red
                  </button>
                </div>
              </div>

              {/* Auto-bet Options */}
              <div className="bg-black/40 p-3 rounded-lg space-y-2">
                <div className="text-sm text-white/60">Auto-bet Rounds</div>
                <div className="grid grid-cols-2 gap-2">
                  {autoBetOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAutoBetCount(option.value)}
                      className={`px-3 py-2 rounded ${
                        autoBetCount === option.value
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      } transition-all text-sm`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Commitment Display */}
              {autoBetCount > 0 && (
                <div className="bg-black/40 p-3 rounded-lg">
                  <div className="text-sm text-white/60">Total Commitment</div>
                  <div className="text-lg font-bold text-white">
                    {(customAmount * autoBetCount).toFixed(3)} SOL
                  </div>
                  <div className="text-sm text-white/60">
                    ({autoBetCount} rounds × {customAmount} SOL)
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedColor}
                  className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {autoBetCount > 0 ? `Start Auto-bet (${autoBetCount})` : 'Place Bet'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 