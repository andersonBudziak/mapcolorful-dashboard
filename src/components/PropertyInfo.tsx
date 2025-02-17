
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface PropertyData {
  car: string;
  municipality: string;
  state: string;
  coordinates: string;
  status: string;
  propertyType: string;
  conception: string;
  farmName: string;
}

const fetchPropertyData = async (car: string): Promise<PropertyData> => {
  try {
    const response = await fetch(`http://localhost:8000/api/property/${car}`);
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  } catch (error) {
    console.log('Using example property data');
    return {
      car: car || "123456789",
      municipality: "Lagoa da Confusão",
      state: "TO",
      coordinates: "-49.757, -10.787",
      status: "Ativo",
      propertyType: "Rural",
      conception: "Própria",
      farmName: "Fazenda Exemplo"
    };
  }
};

const PropertyInfo = () => {
  const { car } = useParams();
  const { data: propertyData, isLoading, error } = useQuery({
    queryKey: ['property', car],
    queryFn: () => fetchPropertyData(car || ''),
    enabled: !!car,
    retry: false
  });

  if (error) {
    toast.error("Erro ao carregar dados da propriedade");
  }

  if (isLoading) {
    return (
      <Card className="p-6 bg-[#F3F4F6]">
        <h2 className="text-xl font-semibold text-[#064C9F] mb-4">Informações da Propriedade</h2>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#064C9F]"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-[#F3F4F6]">
      <h2 className="text-xl font-semibold text-[#064C9F] mb-4">Informações da Propriedade</h2>
      <div className="space-y-3">
        <InfoField label="CAR" value={propertyData?.car || '-'} />
        <InfoField label="Município" value={propertyData?.municipality || '-'} />
        <InfoField label="UF" value={propertyData?.state || '-'} />
        <InfoField label="Lat|Lon" value={propertyData?.coordinates || '-'} />
        <InfoField label="Situação" value={propertyData?.status || '-'} />
        <InfoField label="Tipo imóvel" value={propertyData?.propertyType || '-'} />
        <InfoField label="Concepção" value={propertyData?.conception || '-'} />
        <InfoField label="Nome Fazenda" value={propertyData?.farmName || '-'} />
      </div>
    </Card>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-[#1F2937] font-medium">{label}:</span>
    <span className="text-[#1F2937]">{value}</span>
  </div>
);

export default PropertyInfo;
