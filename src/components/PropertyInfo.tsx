
import { Card } from '@/components/ui/card';

const PropertyInfo = () => {
  return (
    <Card className="p-6 bg-[#F3F4F6]">
      <h2 className="text-xl font-semibold text-[#064C9F] mb-4">Informações da Propriedade</h2>
      <div className="space-y-3">
        <InfoField label="CAR" value="123456789" />
        <InfoField label="Município" value="Exemplo" />
        <InfoField label="UF" value="BA" />
        <InfoField label="Lat|Lon" value="-12.3456, -45.6789" />
        <InfoField label="Situação" value="Regular" />
        <InfoField label="Tipo imóvel" value="Rural" />
        <InfoField label="Concepção" value="Própria" />
        <InfoField label="Nome Fazenda" value="Fazenda Exemplo" />
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
