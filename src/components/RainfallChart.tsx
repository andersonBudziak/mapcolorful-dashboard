
import { Card } from '@/components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RainfallChart = () => {
  const data = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Precipitação (mm)',
        data: [65, 59, 80, 81, 56, 55, 40, 30, 45, 85, 90, 70],
        backgroundColor: '#2980E8',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Pluviosidade Mensal'
      }
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-[#064C9F] mb-4">Pluviosidade</h2>
      <Bar data={data} options={options} />
    </Card>
  );
};

export default RainfallChart;
