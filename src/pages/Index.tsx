
import { useEffect, useState } from 'react';
import PropertyInfo from '@/components/PropertyInfo';
import ScoreCard from '@/components/ScoreCard';
import MapView from '@/components/MapView';
import RainfallChart from '@/components/RainfallChart';
import SoilHistory from '@/components/SoilHistory';
import BiomassCharts from '@/components/BiomassCharts';
import ProductivityTable from '@/components/ProductivityTable';

const Index = () => {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This will be replaced with actual Flask backend call
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/property-data');
        const data = await response.json();
        setPropertyData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#064C9F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/6cbc2bc4-80af-4178-a42d-1b3be3dca26c.png" alt="Logo" className="h-8" />
            <h1 className="text-2xl font-semibold text-[#064C9F]">Relatório Histórico da Área</h1>
          </div>
          <img src="/merx-logo.png" alt="MERX" className="h-8" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PropertyInfo />
          <div className="space-y-8">
            <MapView />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <ScoreCard title="Pluviometria" score="7.5/10" />
              <ScoreCard title="Biomassa" score="8/10" />
              <ScoreCard title="Histórico de Solo" score="9/10" />
              <ScoreCard title="Tipo de Solo" score="9/10" />
              <ScoreCard title="Produtividade Histórica" score="6.5/10" />
              <ScoreCard 
                title="Score Área" 
                score="8/10" 
                highlighted={true}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RainfallChart />
          <SoilHistory />
        </div>
        
        <div className="mt-8">
          <BiomassCharts />
        </div>
        
        <div className="mt-8">
          <ProductivityTable />
        </div>
      </main>
    </div>
  );
};

export default Index;
