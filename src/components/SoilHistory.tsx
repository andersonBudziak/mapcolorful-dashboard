
import { Card } from '@/components/ui/card';
import { Layers } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import soilHistoryExample from '../../api-docs/examples/soil-history.json';

interface CropData {
  percentage: number;
  color: string;
}

interface SoilData {
  year: number;
  crop: Record<string, CropData>;
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
              {Object.entries(item.crop).map(([cropName, cropData]) => (
                <div
                  key={`${item.year}-${cropName}`}
                  style={{ 
                    width: `${cropData.percentage}%`,
                    backgroundColor: cropData.color 
                  }}
                  className="h-full"
                  title={`${cropName}: ${cropData.percentage}%`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {Array.from(uniqueCrops).map(crop => {
          // Pegar a cor do primeiro ano que contém esta cultura
          const firstYearWithCrop = soilData?.find(item => crop in item.crop);
          const cropColor = firstYearWithCrop?.crop[crop].color;
          
          return (
            <div key={crop} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: cropColor }}
              />
              <span className="text-sm text-[#1F2937] truncate" title={crop}>{crop}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SoilHistory;
