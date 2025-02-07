
import { Card } from '@/components/ui/card';

const SoilHistory = () => {
  const years = [2023, 2022, 2021, 2020];
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-[#064C9F] mb-4">Histórico do solo</h2>
      <div className="space-y-4">
        {years.map(year => (
          <div key={year} className="flex items-center space-x-4">
            <span className="w-16 text-[#1F2937] font-medium">{year}</span>
            <div className="flex-1 h-6 bg-pink-200 rounded"></div>
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
