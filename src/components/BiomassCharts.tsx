
import { Card } from '@/components/ui/card';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BiomassCharts = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  };

  const data = {
    labels: Array.from({ length: 12 }, (_, i) => `Mês ${i + 1}`),
    datasets: [
      {
        label: 'NDVI',
        data: Array.from({ length: 12 }, () => Math.random() * 0.8 + 0.2),
        borderColor: '#064C9F',
        backgroundColor: 'rgba(6, 76, 159, 0.5)',
      }
    ]
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-[#064C9F] mb-4">Biomassa</h2>
      <Line options={options} data={data} />
    </Card>
  );
};

export default BiomassCharts;
