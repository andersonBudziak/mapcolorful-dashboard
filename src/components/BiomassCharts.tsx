
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
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import biomassExample from '../../api-docs/examples/biomass.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BiomassData {
  month: string;
  ndvi: number;
}

const fetchBiomassData = async (car: string): Promise<BiomassData[]> => {
  // Temporariamente usando dados de exemplo
  return biomassExample;
};

const BiomassCharts = () => {
  const { car } = useParams();
  const { data: biomassData, isLoading, error } = useQuery({
    queryKey: ['biomass', car],
    queryFn: () => fetchBiomassData(car || ''),
    enabled: !!car,
  });

  if (error) {
    toast.error("Erro ao carregar dados de biomassa");
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-[#064C9F] mb-4">Biomassa</h2>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#064C9F]"></div>
        </div>
      </Card>
    );
  }

  const data = {
    labels: biomassData?.map(item => item.month) || [],
    datasets: [
      {
        label: 'NDVI',
        data: biomassData?.map(item => item.ndvi) || [],
        borderColor: '#064C9F',
        backgroundColor: 'rgba(6, 76, 159, 0.5)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-[#064C9F] mb-4">Biomassa</h2>
      <Line options={options} data={data} />
    </Card>
  );
};

export default BiomassCharts;
