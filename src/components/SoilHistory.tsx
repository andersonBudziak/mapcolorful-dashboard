
import { Card } from '@/components/ui/card';
import { Layers } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import soilHistoryExample from '../../api-docs/examples/soil-history.json';

interface SoilData {
  year: number;
  crop: Record<string, number>;
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
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-5 w-5 text-[#064C9F]" />
          <h2 className="text-xl font-semibold text-[#064C9F]">Histórico do solo</h2>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#064C9F]"></div>
        </div>
      </Card>
    );
  }

  const cropColors: Record<string, string> = {
    'Soja': 'bg-yellow-200',
    'Milho': 'bg-yellow-400',
    'Cana-de-açúcar': 'bg-green-300',
    'Mata Nativa': 'bg-green-800',
    'Pastagem': 'bg-green-400',
    'Área Urbana': 'bg-gray-400',
    'Pasto': 'bg-green-500',
    'Floresta': 'bg-green-900',
    'Agricultura Anual': 'bg-yellow-300',
    'Áreas Alagadas': 'bg-blue-300',
    'Mosaico de Ocupações': 'bg-orange-300',
    'Área Não Vegetada': 'bg-gray-300'
  };

  // Coletar todas as classes únicas de uso do solo
  const uniqueCrops = new Set<string>();
  soilData?.forEach(item => {
    Object.keys(item.crop).forEach(crop => uniqueCrops.add(crop));
  });
  
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="h-5 w-5 text-[#064C9F]" />
        <h2 className="text-xl font-semibold text-[#064C9F]">Histórico do solo</h2>
      </div>
      <div className="space-y-4">
        {soilData?.map(item => (
          <div key={item.year} className="flex items-center space-x-4">
            <span className="w-16 text-[#1F2937] font-medium">{item.year}</span>
            <div className="flex-1 h-6 flex">
              {Object.entries(item.crop).map(([cropName, percentage], index) => (
                <div
                  key={`${item.year}-${cropName}`}
                  className={`h-full ${cropColors[cropName] || 'bg-gray-200'}`}
                  style={{ width: `${percentage}%` }}
                  title={`${cropName}: ${percentage}%`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {Array.from(uniqueCrops).map(crop => (
          <div key={crop} className="flex items-center space-x-2">
            <div className={`w-4 h-4 ${cropColors[crop] || 'bg-gray-200'} rounded`}></div>
            <span className="text-sm text-[#1F2937] truncate" title={crop}>{crop}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SoilHistory;
