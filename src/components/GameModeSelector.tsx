'use client';
import React from 'react';

type GameMode = 'pvp' | 'computer' | null;
type GameStyle = 'cards' | 'roulette' | null;

interface GameModeSelectorProps {
  onModeSelect: (mode: GameMode) => void;
  onStyleSelect: (style: GameStyle) => void;
}

export default function GameModeSelector({ onModeSelect, onStyleSelect }: GameModeSelectorProps) {
  return (
    <div className="w-full max-w-3xl space-y-8">
      {/* Game Mode Selection */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onModeSelect('pvp')}
          className="group relative px-8 py-6 bg-white/10 hover:bg-white/20 rounded-xl transition-all transform hover:scale-105"
        >
          <h3 className="text-xl font-bold text-white">Player vs Player</h3>
          <p className="text-white/60 text-sm mt-1">Battle against a friend</p>
        </button>
        <button
          onClick={() => onModeSelect('computer')}
          className="group relative px-8 py-6 bg-white/10 hover:bg-white/20 rounded-xl transition-all transform hover:scale-105"
        >
          <h3 className="text-xl font-bold text-white">Player vs Computer</h3>
          <p className="text-white/60 text-sm mt-1">Test your luck against AI</p>
        </button>
      </div>

      {/* Game Style Selection */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onStyleSelect('cards')}
          className="group relative px-8 py-6 bg-white/10 hover:bg-white/20 rounded-xl transition-all transform hover:scale-105"
        >
          <h3 className="text-xl font-bold text-white">Card Deck</h3>
          <p className="text-white/60 text-sm mt-1">Classic card game style</p>
        </button>
        <button
          onClick={() => onStyleSelect('roulette')}
          className="group relative px-8 py-6 bg-white/10 hover:bg-white/20 rounded-xl transition-all transform hover:scale-105"
        >
          <h3 className="text-xl font-bold text-white">Roulette</h3>
          <p className="text-white/60 text-sm mt-1">Spin the wheel of fortune</p>
        </button>
      </div>
    </div>
  );
} 