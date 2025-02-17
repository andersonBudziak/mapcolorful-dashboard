import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import MapView from '@/components/MapView';
import propertyExample from '../../api-docs/examples/property.json';

interface Property {
  id: string;
  name: string;
  owner: string;
  municipality: string;
  state: string;
  area: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  propertyType: string;
  status: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

const Reports = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: properties,
    isLoading,
    error
  } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        const response = await fetch('http://localhost:8000/api/properties');
        if (!response.ok) {
          throw new Error('API request failed');
        }
        return response.json();
      } catch (error) {
        console.log('Falling back to example data');
        return propertyExample;
      }
    }
  });

  if (error) {
    toast.error("Erro ao carregar propriedades");
  }

  const filteredProperties = properties?.filter((property: Property) => property.id.toLowerCase().includes(searchTerm.toLowerCase()) || property.name.toLowerCase().includes(searchTerm.toLowerCase()) || property.owner.toLowerCase().includes(searchTerm.toLowerCase()) || property.municipality.toLowerCase().includes(searchTerm.toLowerCase()));

  const handlePropertyClick = (car: string) => {
    navigate(`/report/${car}`);
  };

  return <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/03373f1d-8e1c-4f7b-9268-82d5cb6123a0.png" alt="MERX" className="h-8" />
            <h1 className="text-2xl font-semibold text-[#064C9F]">Relatórios - Histórico agronômico </h1>
          </div>
          <img src="/lovable-uploads/03373f1d-8e1c-4f7b-9268-82d5cb6123a0.png" alt="MERX" className="h-8" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6 mb-8">
          <MapView />
        </Card>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input type="text" placeholder="Buscar por CAR, nome, proprietário ou município..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>

          {isLoading ? <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#064C9F]"></div>
            </div> : <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CAR</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Proprietário</TableHead>
                  <TableHead>Município/UF</TableHead>
                  <TableHead>Área (ha)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties?.map((property: Property) => <TableRow key={property.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>{property.id}</TableCell>
                    <TableCell>{property.name}</TableCell>
                    <TableCell>{property.owner}</TableCell>
                    <TableCell>{`${property.municipality}/${property.state}`}</TableCell>
                    <TableCell>{property.area}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${property.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {property.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handlePropertyClick(property.id)} className="text-[#064C9F]">
                        <MapPin className="h-4 w-4 mr-2" />
                        Ver Relatório
                      </Button>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>}
        </div>
      </main>
    </div>;
};

export default Reports;
