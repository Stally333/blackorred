'use client';
import React, { useState } from 'react';
import GameBoard from '../components/GameBoard';
import Header from '@/components/Header';

export default function Home() {
  const [gameStyle, setGameStyle] = useState<'cards' | 'roulette'>('cards');

  return (
    <>
      <Header 
        onGameStyleChange={setGameStyle}
        currentGameStyle={gameStyle}
      />
      <main className="h-[calc(100vh-4rem)] px-4 flex items-center justify-center">
        <div className="w-full -mt-8">
          <GameBoard gameStyle={gameStyle} />
        </div>
      </main>
    </>
  );
}
