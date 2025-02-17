
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
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import rainfallExample from '../../api-docs/examples/rainfall.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RainfallData {
  month: string;
  value: number;
}

const fetchRainfallData = async (car: string): Promise<RainfallData[]> => {
  // Temporariamente usando dados de exemplo
  return rainfallExample;
};

const RainfallChart = () => {
  const { car } = useParams();
  const { data: rainfallData, isLoading, error } = useQuery({
    queryKey: ['rainfall', car],
    queryFn: () => fetchRainfallData(car || ''),
    enabled: !!car,
  });

  if (error) {
    toast.error("Erro ao carregar dados de pluviosidade");
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-[#064C9F] mb-4">Pluviosidade</h2>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#064C9F]"></div>
        </div>
      </Card>
    );
  }

  const data = {
    labels: rainfallData?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Precipitação (mm)',
        data: rainfallData?.map(item => item.value) || [],
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
