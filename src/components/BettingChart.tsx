import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BettingChartProps {
  history: Array<{
    amount: number;
    result: 'win' | 'loss';
    balance: number;
    timestamp: number;
  }>;
}

export default function BettingChart({ history }: BettingChartProps) {
  const data = {
    labels: history.map((_, i) => `Bet ${i + 1}`),
    datasets: [
      {
        label: 'Balance',
        data: history.map(h => h.balance),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Betting History',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-64 w-full bg-white/5 rounded-xl p-4">
      <Line data={data} options={options} />
    </div>
  );
} 