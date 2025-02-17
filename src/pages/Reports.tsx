
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MapView from '@/components/MapView';

const Reports = () => {
  const navigate = useNavigate();
  const [searchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/6cbc2bc4-80af-4178-a42d-1b3be3dca26c.png" alt="Logo" className="h-8" />
            <h1 className="text-2xl font-semibold text-[#064C9F]">Áreas Monitoradas</h1>
          </div>
          <img src="/merx-logo.png" alt="MERX" className="h-8" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Áreas</CardTitle>
            </CardHeader>
            <CardContent>
              <MapView />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Informações dos talhões */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate('/report/TO-1711902-33372BB6685F44119E084DD4C8FE69AB')}>
              <CardHeader>
                <CardTitle>Talhão 1</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Área: 65.26 ha</p>
                <p>Cultura: Arroz</p>
                <p>Plantio: 20/12/2024 á 04/01/2025</p>
                <p>Colheita: 15/04/2025 á 25/04/2025</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate('/report/TO-1711902-33372BB6685F44119E084DD4C8FE69AB')}>
              <CardHeader>
                <CardTitle>Talhão 2</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Área: 37.98 ha</p>
                <p>Cultura: Não identificada</p>
                <p>Plantio: 25/12/2024 á 05/01/2025</p>
                <p>Colheita: -</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate('/report/TO-1711902-33372BB6685F44119E084DD4C8FE69AB')}>
              <CardHeader>
                <CardTitle>Talhão 3</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Área: 25.37 ha</p>
                <p>Cultura: Não identificada</p>
                <p>Plantio: 15/01/2025 á 25/01/2025</p>
                <p>Colheita: -</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
