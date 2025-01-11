import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
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

interface BettingHistoryProps {
  history: Array<{
    amount: number;
    result: 'win' | 'loss';
    balance: number;
    timestamp: number;
    color: 'black' | 'red';
  }>;
}

export default function BettingHistory({ history }: BettingHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="w-full bg-white/5 rounded-xl p-4 backdrop-blur-sm text-center">
        <p className="text-white/60">No betting history yet</p>
      </div>
    );
  }

  const data = {
    labels: history.map((_, i) => `Game ${history.length - i}`).reverse(),
    datasets: [
      {
        label: 'Balance',
        data: history.map(h => h.balance),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'Bet Amount',
        data: history.map(h => h.amount),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: 'Inter',
          },
        },
      },
      title: {
        display: true,
        text: 'Betting History',
        color: 'rgba(255, 255, 255, 0.8)',
        font: {
          size: 16,
          family: 'Inter',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            const result = history[dataIndex].result;
            const color = history[dataIndex].color;
            return `${context.dataset.label}: ${context.parsed.y} SOL (${result} - ${color})`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
  };

  return (
    <div className="w-full bg-white/5 rounded-xl p-4 backdrop-blur-sm">
      <div className="h-64">
        <Line options={options} data={data} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-lg p-2">
          <div className="text-white/60 text-xs">Total Games</div>
          <div className="text-white font-bold">{history.length}</div>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <div className="text-white/60 text-xs">Win Rate</div>
          <div className="text-white font-bold">
            {Math.round((history.filter(h => h.result === 'win').length / history.length) * 100)}%
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <div className="text-white/60 text-xs">Net Profit</div>
          <div className={`font-bold ${history[0].balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {history[0].balance.toFixed(2)} SOL
          </div>
        </div>
      </div>
    </div>
  );
} 