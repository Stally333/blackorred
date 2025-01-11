'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { truncateAddress } from '@/utils/format';
import Avatar from './Avatar';
import GameStats from './GameStats';
import Card from './Card';

interface GameBoardProps {
  gameStyle: 'cards' | 'roulette';
}

interface PlayerStats {
  name: string;
  walletAddress?: string;
  avatarColor: string;
  score: number;
  selectedColor: 'black' | 'red' | null;
  wins: number;
  streak: number;
  totalBets: number;
  winRate: number;
  currentBet: number;
  balance: number;
  team: 'BLACK' | 'RED' | null;
}

export default function GameBoard({ gameStyle }: GameBoardProps) {
  const [selectedDeck, setSelectedDeck] = useState('single');
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResults, setLastResults] = useState<('black' | 'red')[]>([]);
  const [currentCard, setCurrentCard] = useState<'black' | 'red' | null>(null);
  const [isCardRevealed, setIsCardRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [randomSeed, setRandomSeed] = useState(0.5);
  const [isLoading, setIsLoading] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentTaunt, setCurrentTaunt] = useState('');
  const [lastResult, setLastResult] = useState<{
    winner: 'player' | 'house';
    amount: number;
    color: 'black' | 'red';
  } | null>(null);
  const [deck, setDeck] = useState<Array<{color: 'black' | 'red', suit: string, value: string}>>([]);
  const [remainingBlack, setRemainingBlack] = useState(26);
  const [remainingRed, setRemainingRed] = useState(26);
  
  const [player, setPlayer] = useState<PlayerStats>({
    name: 'Player',
    walletAddress: '0x1234...5678',
    avatarColor: '#4f46e5',
    score: 0,
    selectedColor: null,
    wins: 12,
    streak: 3,
    totalBets: 24,
    winRate: 50,
    currentBet: 0,
    balance: 10,
    team: null
  });

  const [house, setHouse] = useState<PlayerStats>({
    name: 'House',
    walletAddress: '0xHouse...Bank',
    avatarColor: '#1a1a1a',
    score: 0,
    selectedColor: null,
    wins: 8,
    streak: 1,
    totalBets: 24,
    winRate: 33.33,
    currentBet: 0,
    balance: 1000000,
    team: null
  });

  useEffect(() => {
    setRandomSeed(Math.random());
  }, []);

  useEffect(() => {
    // Initialize any browser-specific state here
    const initialHouseStats = {
      totalGamesPlayed: Math.floor(Math.random() * 2000),
      dailyVolume: (Math.random() * 10000).toFixed(2),
      // ... other random initial values
    };
    
    // Update state here
  }, []);

  useEffect(() => {
    // Initialize client-side state
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (remainingBlack === 0 || remainingRed === 0) {
      // Reset deck
      setRemainingBlack(26);
      setRemainingRed(26);
    }
  }, [remainingBlack, remainingRed]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  const handleColorSelect = (color: 'black' | 'red') => {
    // Player selection
    setPlayer(prev => ({ 
      ...prev, 
      selectedColor: color,
      team: color.toUpperCase() as 'BLACK' | 'RED'
    }));

    // House automatically picks opposite color
    setHouse(prev => ({ 
      ...prev, 
      selectedColor: color === 'black' ? 'red' : 'black',
      team: color === 'black' ? 'RED' : 'BLACK'
    }));
  };

  const calculateOdds = (color: 'black' | 'red') => {
    const total = remainingBlack + remainingRed;
    const remaining = color === 'black' ? remainingBlack : remainingRed;
    return ((remaining / total) * 100).toFixed(1);
  };

  const handleDraw = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setIsCardRevealed(false);
    
    // Calculate probability based on remaining cards
    const total = remainingBlack + remainingRed;
    const blackProbability = remainingBlack / total;
    
    // Draw card based on real probability
    const newCard = Math.random() < blackProbability ? 'black' : 'red';
    setCurrentCard(newCard);
    
    // Update remaining cards
    if (newCard === 'black') {
      setRemainingBlack(prev => prev - 1);
    } else {
      setRemainingRed(prev => prev - 1);
    }
    
    setTimeout(() => {
      setIsCardRevealed(true);
      setIsDrawing(false);
      
      // Update results
      setLastResults(prev => [newCard, ...prev].slice(0, 10));
      
      const isPlayerWinner = player.selectedColor === newCard;
      const betAmount = player.currentBet;
      
      // Set result data for modal
      setLastResult({
        winner: isPlayerWinner ? 'player' : 'house',
        amount: betAmount,
        color: newCard
      });

      // Update stats
      if (isPlayerWinner) {
        setPlayer(prev => ({
          ...prev,
          wins: prev.wins + 1,
          streak: prev.streak + 1,
          totalBets: prev.totalBets + 1,
          winRate: Math.round((prev.wins + 1) / (prev.totalBets + 1) * 100),
          balance: prev.balance + betAmount
        }));
      } else {
        setPlayer(prev => ({
          ...prev,
          streak: 0,
          totalBets: prev.totalBets + 1,
          winRate: Math.round(prev.wins / (prev.totalBets + 1) * 100),
          balance: prev.balance - betAmount
        }));
      }

      // Set random taunt
      const HOUSE_TAUNTS = [
        "Better luck next time! 😈",
        "House always wins! 🎰",
        "Thanks for the SOL! 💰",
        "Want to try again? 😏",
        "Easy money! 🤑",
        "Another one bites the dust! 💫",
      ];
      setCurrentTaunt(HOUSE_TAUNTS[Math.floor(Math.random() * HOUSE_TAUNTS.length)]);

      // Show modal after a 2 second delay (1s for card reveal + 1s additional wait)
      setTimeout(() => {
        setShowResultModal(true);
      }, 2000); // Changed from 1000 to 2000
    }, 1000);
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    // Add spinning animation and logic here
    setTimeout(() => {
      setIsSpinning(false);
      const result = Math.random() > 0.5 ? 'black' : 'red';
      setLastResults(prev => [result, ...prev].slice(0, 10));
    }, 3000);
  };

  const ResultModal = () => {
    const HOUSE_TAUNTS = [
      "Better luck next time! 😈",
      "House always wins! 🎰",
      "Thanks for the SOL! 💰",
      "Want to try again? 😏",
      "Easy money! 🤑",
      "Another one bites the dust! 💫",
    ];

    const handleClose = () => {
      setShowResultModal(false);
      setIsCardRevealed(false);
      setCurrentCard(null);
      // Reset player selections
      setPlayer(prev => ({
        ...prev,
        selectedColor: null,
        team: null
      }));
      setHouse(prev => ({
        ...prev,
        selectedColor: null,
        team: null
      }));
    };

    return (
      <AnimatePresence>
        {showResultModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-zinc-900 to-black p-6 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className={`text-4xl font-bold ${
                  lastResult?.winner === 'player' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {lastResult?.winner === 'player' ? 'You Won! 🎉' : 'House Wins! 😈'}
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="text-white/60 text-lg">Bet Amount:</div>
                  <div className="text-2xl font-bold text-white">
                    {lastResult?.amount} SOL
                  </div>
                </div>

                <div className="text-3xl font-bold">
                  {lastResult?.winner === 'player' ? (
                    <>
                      <div className="text-green-500">+{lastResult.amount * 2} SOL</div>
                      <div className="text-sm text-green-400/60 mt-1">
                        (Initial: {lastResult.amount} SOL + Win: {lastResult.amount} SOL)
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-red-500">-{lastResult.amount} SOL</div>
                      <div className="text-sm text-red-400/60 mt-1">
                        Better luck next time!
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-center gap-4 text-lg bg-white/5 rounded-xl p-3">
                  <span className="text-white/60">Winning Color:</span>
                  <span className="text-white font-bold flex items-center gap-2">
                    {lastResult?.color === 'black' ? (
                      <>
                        <span className="text-2xl">⚫</span> Black
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">🔴</span> Red
                      </>
                    )}
                  </span>
                </div>

                <div className="text-xl text-white/80 italic">
                  "{currentTaunt}"
                </div>

                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-white/60 text-sm">New Balance:</div>
                  <div className="text-xl font-bold text-white">
                    {player.balance} SOL
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3 rounded-xl w-full"
                  onClick={handleClose}
                >
                  Play Again
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto h-[calc(100vh-12rem)] relative">
      <ResultModal />
      {/* Joker Dealer - Adjusted positioning */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-64 h-64 z-30 -top-8" // Changed from -top-20 to -top-8
        style={{ 
          filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.3))',
          transformOrigin: 'center bottom'
        }}
        animate={{ 
          y: [0, -8, 0],
          rotate: [-1, 1, -1],
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.img
          src="/dealer-joker.png"
          alt="Dealer"
          className="w-full h-full object-contain"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05, rotate: -5 }}
        />
        
        {/* Speech Bubble for Dealer */}
        {isDrawing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 whitespace-nowrap"
          >
            <span className="text-white font-medium">
              {isDrawing ? "Shuffling the cards... 🎭" : "Place your bets! 🃏"}
            </span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-white/10 border-r-[8px] border-r-transparent" />
          </motion.div>
        )}
      </motion.div>

      <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-2 shadow-2xl border border-white/10 h-full">
        {/* Game Header - Centered */}
        <div className="flex justify-center items-center mb-2">
          <div className="flex items-center gap-4">
            {/* GameStats removed from here */}
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex gap-2 items-stretch h-[calc(100%-3rem)]">
          {/* Player Card */}
          <PlayerCard player={player} side="left" onColorSelect={handleColorSelect} />
          
          {/* Center Game Area */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {gameStyle === 'cards' ? (
              <div className="relative w-full h-[calc(100%-3rem)] flex items-center justify-center">
                {/* Combined Dealer and Card Container */}
                <div className="relative flex flex-col items-center justify-center">
                  {/* Card Display Container - Centered */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 shadow-xl transform scale-110 z-10 mt-16">
                    <div className="relative">
                      {currentCard ? (
                        <Card
                          color={currentCard}
                          isRevealed={isCardRevealed}
                          onReveal={() => setIsCardRevealed(true)}
                        />
                      ) : (
                        <div className="w-[250px] h-[350px] flex items-center justify-center">
                          <motion.button
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm text-white font-medium transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDraw}
                            disabled={isDrawing || !player.selectedColor}
                          >
                            {isDrawing ? (
                              <span className="flex items-center gap-2">
                                <motion.span
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  🎴
                                </motion.span>
                                Drawing...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                🎴 Draw Cards
                              </span>
                            )}
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title and Stats moved below card */}
                  <div className="mt-12 text-center flex items-center justify-center gap-4">
                    <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                      Player vs House
                    </h2>
                    <GameStats lastResults={lastResults} />
                  </div>
                </div>
              </div>
            ) : (
              <motion.div 
                className="relative w-full h-[calc(100%-2.5rem)] rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="absolute inset-0 border-8 border-white/10 rounded-full"
                  animate={{ rotate: isSpinning ? 360 * 5 : 0 }}
                  transition={{ duration: 3, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-full bg-gradient-to-b from-red-600 to-transparent" />
                  </div>
                </motion.div>
                <motion.button 
                  className="absolute inset-0 flex items-center justify-center text-white hover:text-white transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSpin}
                  disabled={isSpinning}
                >
                  {isSpinning ? 'Spinning...' : 'Click to Spin'}
                </motion.button>
              </motion.div>
            )}

            {/* Deck Controls - Moved closer to the bottom */}
            <div className="flex gap-2 mt-auto pt-4">
              {['Single', 'Double', 'Triple'].map((deck) => (
                <motion.button
                  key={deck}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDeck(deck.toLowerCase())}
                  className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                    selectedDeck === deck.toLowerCase()
                      ? 'bg-gradient-to-r from-white/20 to-white/10 text-white shadow-lg shadow-black/20'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {deck} Deck
                </motion.button>
              ))}
            </div>
          </div>

          {/* House Card */}
          <PlayerCard 
            player={house} 
            side="right" 
            onColorSelect={() => {}}
            isHouse={true}
            houseState={house}
          />
        </div>
      </div>
    </div>
  );
}

// Enhanced StatCard Component with better visuals
const StatCard = ({ label, value }: { label: string, value: string | number }) => (
  <motion.div 
    className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-1.5 backdrop-blur-sm hover:from-white/15 hover:to-white/10 transition-all cursor-pointer group"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center justify-between">
      <p className="text-white/60 text-xs font-medium">{label}</p>
      <motion.p 
        className="text-sm font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {value}
      </motion.p>
    </div>
  </motion.div>
);

// Add BetHistory component
const BetHistory = ({ history }: { history: Array<{ amount: number, color: 'black' | 'red', result?: 'win' | 'loss' }> }) => (
  <div className="py-2">
    <h4 className="text-white/60 text-xs font-medium mb-2">Bet History</h4>
    <div className="space-y-1 max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
      {history.map((bet, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center justify-between p-1.5 rounded-lg ${
            bet.result === 'win' 
              ? 'bg-green-500/10 border border-green-500/20' 
              : bet.result === 'loss'
              ? 'bg-red-500/10 border border-red-500/20'
              : 'bg-white/5 border border-white/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">{bet.color === 'black' ? '⚫' : '🔴'}</span>
            <span className="text-xs font-medium text-white">{bet.amount} SOL</span>
          </div>
          {bet.result && (
            <span className={`text-xs font-medium ${
              bet.result === 'win' ? 'text-green-400' : 'text-red-400'
            }`}>
              {bet.result === 'win' ? '+' + (bet.amount * 2) : '-' + bet.amount} SOL
            </span>
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

// Updated PlayerCard Component with color selection
const PlayerCard = ({ 
  player, 
  side, 
  onColorSelect,
  isHouse = false,
  houseState  
}: { 
  player: PlayerStats, 
  side: 'left' | 'right',
  onColorSelect: (color: 'black' | 'red') => void,
  isHouse?: boolean,
  houseState?: PlayerStats
}) => {
  const HOUSE_TAUNTS = [
    "Better luck next time! 😈",
    "House always wins! 🎰",
    "Thanks for the SOL! 💰",
    "Want to try again? 😏",
    "Easy money! 🤑",
    "Another one bites the dust! 💫",
    "Your SOL is my SOL now! ✨",
    "Don't give up yet! 🎲",
    "Fortune favors the house! 🏦",
    "Keep them coming! 🌟"
  ];

  const [betAmount, setBetAmount] = useState(player.currentBet || 0);
  const [dailyVolume] = useState((Math.random() * 10000).toFixed(2));
  const [currentTaunt, setCurrentTaunt] = useState(HOUSE_TAUNTS[0]);

  useEffect(() => {
    // Update taunt after component mounts
    setCurrentTaunt(HOUSE_TAUNTS[Math.floor(Math.random() * HOUSE_TAUNTS.length)]);
  }, []);

  const handleBetChange = (value: number) => {
    if (value >= 0 && value <= player.balance) {
      setBetAmount(value);
    }
  };

  // Add this at the top of PlayerCard component
  const houseStats = {
    totalGamesPlayed: 1234,
    houseEdge: '2.5%',
    maxPayout: '1000 SOL',
    activeGames: 8
  };

  // Add this back for the bet history
  const betHistory = [
    { amount: 100, color: 'black' as const, result: 'win' as const },
    { amount: 50, color: 'red' as const, result: 'loss' as const },
    { amount: 75, color: 'black' as const, result: 'win' as const },
  ];

  return (
    <motion.div 
      className="w-64"
      initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full bg-gradient-to-b from-white/10 to-transparent rounded-2xl p-1.5 backdrop-blur-sm border border-white/10">
        <div className="flex flex-col h-full">
          {/* Player Header */}
          <div className="flex items-center gap-3 pb-2 border-b border-white/10">
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.05 }}
            >
              <Avatar 
                type={isHouse ? 'house' : 'player'}
                color={player.avatarColor}
                size={42}
                className="group-hover:opacity-90"
              />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white truncate bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {player.name}
                </h3>
                {player.walletAddress && (
                  <span className={`text-xs truncate font-mono ${
                    isHouse ? 'text-red-400/80' : 'text-white/60'
                  }`}>
                    ({truncateAddress(player.walletAddress)})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Add margin after header if it's the house card */}
          {isHouse && <div className="h-2" />}

          {/* Only show betting controls for player, not house */}
          {!isHouse && (
            <div className="mt-2">
              {/* Balance and Bet Input */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/60 text-xs">Balance:</span>
                <span className="text-white text-sm font-medium">{player.balance} SOL</span>
              </div>
              <div className="flex gap-1 items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleBetChange(Math.max(0, betAmount - 0.1))}
                  className="w-7 h-7 flex items-center justify-center bg-white/10 rounded-lg hover:bg-white/20 text-sm"
                >
                  -
                </motion.button>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => handleBetChange(Number(e.target.value))}
                  className="flex-1 bg-white/10 rounded-lg px-2 py-1 text-center text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  max={player.balance}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleBetChange(Math.min(player.balance, betAmount + 0.1))}
                  className="w-7 h-7 flex items-center justify-center bg-white/10 rounded-lg hover:bg-white/20 text-sm"
                >
                  +
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-1 py-1.5 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white font-medium text-xs"
              >
                Place {betAmount} SOL
              </motion.button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-0.5 mt-1.5">
            <StatCard label="Wins" value={player.wins} />
            <StatCard label="Win Rate" value={`${player.winRate}%`} />
            <StatCard label="Streak" value={player.streak} />
            <StatCard label="Total Bets" value={player.totalBets} />
          </div>

          {/* Bet History - only show for player */}
          {!isHouse && (
            <div className="mt-2">
              <BetHistory history={betHistory} />
            </div>
          )}

          {/* Spacer to push buttons to bottom */}
          <div className="flex-1" />

          {/* Team Display (if selected) */}
          {player.team && (
            <div className={`mt-3 px-2 py-1.5 rounded-lg text-center text-sm font-medium ${
              player.team === 'BLACK' 
                ? 'bg-gradient-to-r from-zinc-900 to-black text-white'
                : 'bg-gradient-to-r from-red-600 to-red-800 text-white'
            }`}>
              TEAM {player.team}
            </div>
          )}

          {/* Color Selection - only for player */}
          {!isHouse && (
            <div className="mt-2 flex gap-2">
              <motion.button
                className={`flex-1 py-4 rounded-xl backdrop-blur-sm transition-all ${
                  player.team === 'BLACK'
                    ? 'bg-gradient-to-br from-zinc-800 to-black text-white ring-2 ring-white/40 shadow-lg shadow-black/50'
                    : 'bg-gradient-to-br from-zinc-800/80 to-black/80 text-white/90 hover:text-white hover:from-zinc-800 hover:to-black hover:ring-2 hover:ring-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onColorSelect('black')}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">⚫</span>
                  <span className="font-bold text-base">Black</span>
                </div>
              </motion.button>
              <motion.button
                className={`flex-1 py-4 rounded-xl backdrop-blur-sm transition-all ${
                  player.team === 'RED'
                    ? 'bg-gradient-to-br from-red-600 to-red-800 text-white ring-2 ring-white/40 shadow-lg shadow-red-500/50'
                    : 'bg-gradient-to-br from-red-600/80 to-red-800/80 text-white/90 hover:text-white hover:from-red-600 hover:to-red-800 hover:ring-2 hover:ring-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onColorSelect('red')}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">🔴</span>
                  <span className="font-bold text-base">Red</span>
                </div>
              </motion.button>
            </div>
          )}

          {isHouse && (
            <div className="mt-1.5 space-y-1.5">
              {/* House Stats Panel */}
              <div className="bg-white/5 rounded-lg p-1.5">
                <div className="grid grid-cols-2 gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">House Edge:</span>
                    <span className="text-white font-medium">{houseStats.houseEdge}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Max Payout:</span>
                    <span className="text-white font-medium">{houseStats.maxPayout}</span>
                  </div>
                </div>
              </div>

              {/* Active Games */}
              <div className="bg-white/5 rounded-lg p-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">Active Games:</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
                    <span className="text-white font-medium text-xs">{houseStats.activeGames}</span>
                  </div>
                </div>
              </div>

              {/* Game Section */}
              <div className="flex flex-col space-y-2 my-2">
                {/* House Color Selection Display */}
                <div className="flex gap-2 justify-center">
                  <motion.div
                    className={`w-[45%] py-2 rounded-xl backdrop-blur-sm transition-all ${
                      player.selectedColor === 'black'
                        ? 'bg-gradient-to-br from-zinc-800 to-black text-white ring-2 ring-white/40 shadow-lg shadow-black/50'
                        : 'bg-gradient-to-br from-zinc-800/80 to-black/80 text-white/40'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    animate={{ 
                      scale: player.selectedColor === 'black' ? [1, 1.02, 1] : 1 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">⚫</span>
                      <span className="font-medium text-sm">Black</span>
                    </div>
                  </motion.div>
                  <motion.div
                    className={`w-[45%] py-2 rounded-xl backdrop-blur-sm transition-all ${
                      player.selectedColor === 'red'
                        ? 'bg-gradient-to-br from-red-600 to-red-800 text-white ring-2 ring-white/40 shadow-lg shadow-red-500/50'
                        : 'bg-gradient-to-br from-red-600/80 to-red-800/80 text-white/40'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    animate={{ 
                      scale: player.selectedColor === 'red' ? [1, 1.02, 1] : 1 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">🔴</span>
                      <span className="font-medium text-sm">Red</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="space-y-1">
                {/* Recent Payouts */}
                <div className="bg-white/5 rounded-lg p-1.5">
                  <span className="text-white/60 text-xs block mb-1">Recent Payouts</span>
                  <div className="space-y-1">
                    {[
                      { amount: 25.5, time: '2m ago' },
                      { amount: 12.8, time: '5m ago' },
                      { amount: 50.0, time: '8m ago' },
                    ].map((payout, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between text-xs bg-white/5 rounded-lg p-1.5"
                      >
                        <span className="text-green-400 font-medium">+{payout.amount} SOL</span>
                        <span className="text-white/40">{payout.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 24h Volume */}
                <div className="bg-white/5 rounded-lg p-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">24h Volume:</span>
                    <motion.span 
                      className="text-white font-medium text-xs"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {dailyVolume} SOL
                    </motion.span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 