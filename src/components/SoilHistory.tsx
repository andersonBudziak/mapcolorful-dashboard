
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import soilHistoryExample from '../../api-docs/examples/soil-history.json';

interface SoilData {
  year: number;
  crop: string;
}

const fetchSoilHistory = async (car: string): Promise<SoilData[]> => {
  try {
    const response = await fetch(`http://localhost:8000/api/soil-history/${car}`);
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  } catch (error) {
    console.log('Falling back to example soil history data');
    return soilHistoryExample;
  }
};

const SoilHistory = () => {
  const { car } = useParams();
  const { data: soilData, isLoading, error } = useQuery({
    queryKey: ['soil-history', car],
    queryFn: () => fetchSoilHistory(car || ''),
    enabled: !!car,
  });

  if (error) {
    toast.error("Erro ao carregar histórico do solo");
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-[#064C9F] mb-4">Histórico do solo</h2>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#064C9F]"></div>
        </div>
      </Card>
    );
  }

  const cropColors: Record<string, string> = {
    'Soja': 'bg-pink-200',
    'Pasto': 'bg-green-200'
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-[#064C9F] mb-4">Histórico do solo</h2>
      <div className="space-y-4">
        {soilData?.map(item => (
          <div key={item.year} className="flex items-center space-x-4">
            <span className="w-16 text-[#1F2937] font-medium">{item.year}</span>
            <div className={`flex-1 h-6 ${cropColors[item.crop]} rounded`}></div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-pink-200 rounded"></div>
          <span className="text-sm text-[#1F2937]">Soja</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-200 rounded"></div>
          <span className="text-sm text-[#1F2937]">Pasto</span>
        </div>
      </div>
    </Card>
  );
};

export default SoilHistory;
