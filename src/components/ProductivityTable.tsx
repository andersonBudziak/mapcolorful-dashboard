
import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
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
import { toast } from 'sonner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProductivityData {
  year: string;
  value: number;
}

const fetchProductivityData = async (): Promise<ProductivityData[]> => {
  const response = await fetch('http://localhost:8000/api/productivity');
  if (!response.ok) {
    throw new Error('Erro ao buscar dados de produtividade');
  }
  return response.json();
};

const ProductivityTable = () => {
  const { data: productivityData, isLoading, error } = useQuery({
    queryKey: ['productivity'],
    queryFn: fetchProductivityData,
  });

  if (error) {
    toast.error("Erro ao carregar dados de produtividade");
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-[#064C9F]" />
          <h2 className="text-xl font-semibold text-[#064C9F]">Produtividade histórica</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#064C9F]"></div>
        </div>
      </Card>
    );
  }

  const chartData = {
    labels: productivityData?.map(item => item.year) || [],
    datasets: [
      {
        label: 'Produtividade (kg/ha)',
        data: productivityData?.map(item => item.value) || [],
        backgroundColor: '#2980E8',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 3000,
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-[#064C9F]" />
        <h2 className="text-xl font-semibold text-[#064C9F]">Produtividade histórica</h2>
      </div>
      <Bar data={chartData} options={options} />
    </Card>
  );
};

export default ProductivityTable;
