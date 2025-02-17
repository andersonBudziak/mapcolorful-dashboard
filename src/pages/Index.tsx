import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileDown, Droplets, Leaf, Layers, TrendingUp, Earth } from 'lucide-react';
import { toast } from 'sonner';
import PropertyInfo from '@/components/PropertyInfo';
import ScoreCard from '@/components/ScoreCard';
import RainfallChart from '@/components/RainfallChart';
import SoilHistory from '@/components/SoilHistory';
import BiomassCharts from '@/components/BiomassCharts';
import ProductivityTable from '@/components/ProductivityTable';
import MapView from '@/components/MapView';

const Index = () => {
  const { car } = useParams();
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for CAR:', car);
        const response = await fetch(`http://localhost:8000/api/property/${car}`);
        if (!response.ok) {
          throw new Error('API request failed');
        }
        const data = await response.json();
        setPropertyData(data);
      } catch (error) {
        console.log('Falling back to example data');
        const data = await import('../../api-docs/examples/property.json');
        setPropertyData(data.default);
      } finally {
        setLoading(false);
      }
    };

    if (!car) {
      navigate('/');
      return;
    }

    fetchData();
  }, [car, navigate]);

  const handleDownloadPDF = async () => {
    if (downloading) return;
    
    setDownloading(true);
    toast.loading("Gerando relatório...");
    
    try {
      const content = `
Relatório da Propriedade
CAR: ${car}
Data: ${new Date().toLocaleDateString()}

Informações da Propriedade
-------------------------
Nome: ${propertyData?.name || 'N/A'}
Proprietário: ${propertyData?.owner || 'N/A'}
Município: ${propertyData?.municipality || 'N/A'}
Estado: ${propertyData?.state || 'N/A'}
Área: ${propertyData?.area || 'N/A'} ha

Este é um relatório gerado automaticamente com dados de exemplo.
      `.trim();
      
      const blob = new Blob([content], { type: 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${car}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.dismiss();
      toast.success("Relatório exportado com sucesso!");
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.dismiss();
      toast.error("Erro ao gerar o relatório. Por favor, tente novamente.");
    } finally {
      setDownloading(false);
    }
  };

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
            <img src="/lovable-uploads/03373f1d-8e1c-4f7b-9268-82d5cb6123a0.png" alt="MERX" className="h-8" />
            <h1 className="text-2xl font-semibold text-[#064C9F]">Relatório Histórico da Área</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="flex items-center gap-2 text-[#064C9F] border-[#064C9F] hover:bg-[#064C9F] hover:text-white"
              disabled={downloading}
            >
              <FileDown className="h-4 w-4" />
              {downloading ? 'Exportando...' : 'Baixar PDF'}
            </Button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-[#064C9F] hover:bg-[#F3F4F6] rounded-md transition-colors"
            >
              Voltar
            </button>
            <img src="/lovable-uploads/03373f1d-8e1c-4f7b-9268-82d5cb6123a0.png" alt="MERX" className="h-8" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PropertyInfo />
          <div className="space-y-8">
            <MapView carFilter={car} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <ScoreCard title="Pluviometria" score="7.5/10" icon={<Droplets className="h-5 w-5" />} />
              <ScoreCard title="Biomassa" score="8/10" icon={<Leaf className="h-5 w-5" />} />
              <ScoreCard title="Histórico de Solo" score="9/10" icon={<Layers className="h-5 w-5" />} />
              <ScoreCard title="Tipo de Solo" score="9/10" icon={<Earth className="h-5 w-5" />} />
              <ScoreCard title="Produtividade Histórica" score="6.5/10" icon={<TrendingUp className="h-5 w-5" />} />
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
