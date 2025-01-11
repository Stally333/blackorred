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