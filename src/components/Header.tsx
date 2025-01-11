'use client';
import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  onGameStyleChange?: (style: 'cards' | 'roulette') => void;
  currentGameStyle?: 'cards' | 'roulette';
}

export default function Header({ onGameStyleChange, currentGameStyle }: HeaderProps) {
    return (
      <header className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <span className="text-white/20 text-2xl mr-2">♠</span>BLACK<span className="text-red-500">SOL</span>RED<span className="text-red-500/20 text-2xl ml-2">♥</span>
            </Link>
            
            {onGameStyleChange && (
            <nav className="flex gap-6">
              <button
                onClick={() => onGameStyleChange('cards')}
                className={`text-sm font-medium transition-all ${
                  currentGameStyle === 'cards'
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => onGameStyleChange('roulette')}
                className={`text-sm font-medium transition-all ${
                  currentGameStyle === 'roulette'
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Roulette
              </button>
              <Link
                href="/statistics"
                className="text-sm font-medium text-white/60 hover:text-white transition-all"
              >
                Statistics
              </Link>
            </nav>
          )}
        </div>

        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all">
          Connect Wallet
        </button>
      </div>
    </header>
  );
}