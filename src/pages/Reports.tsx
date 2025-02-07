
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from 'react';
import { toast } from 'sonner';

interface Report {
  car: string;
  propertyName: string;
  date: string;
  state: string;
}

const Reports = () => {
  const navigate = useNavigate();
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  
  // Dados mockados - serão substituídos pela chamada ao backend Flask
  const reports: Report[] = [
    {
      car: "123456789",
      propertyName: "Fazenda Exemplo",
      date: "2024-03-15",
      state: "BA",
    },
    {
      car: "987654321",
      propertyName: "Fazenda São João",
      date: "2024-03-14",
      state: "GO",
    },
  ];

  const handleReportClick = (car: string) => {
    navigate(`/report/${car}`);
  };

  const handleCheckboxChange = (car: string) => {
    setSelectedCars(prev => {
      if (prev.includes(car)) {
        return prev.filter(selectedCar => selectedCar !== car);
      } else {
        return [...prev, car];
      }
    });
  };

  const handleExportSelected = async () => {
    if (selectedCars.length === 0) {
      toast.error("Selecione pelo menos um relatório para exportar");
      return;
    }

    try {
      // Esta chamada será substituída pela chamada real ao backend
      const response = await fetch('http://localhost:5000/api/export-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cars: selectedCars }),
      });

      if (!response.ok) throw new Error('Erro ao exportar relatórios');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorios.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Relatórios exportados com sucesso!");
      setSelectedCars([]);
    } catch (error) {
      toast.error("Erro ao exportar relatórios");
      console.error('Erro:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/6cbc2bc4-80af-4178-a42d-1b3be3dca26c.png" alt="Logo" className="h-8" />
            <h1 className="text-2xl font-semibold text-[#064C9F]">Histórico de Relatórios</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleExportSelected}
              variant="outline"
              className="flex items-center gap-2 text-[#064C9F] border-[#064C9F] hover:bg-[#064C9F] hover:text-white"
              disabled={selectedCars.length === 0}
            >
              <FileDown className="h-4 w-4" />
              Exportar Selecionados
            </Button>
            <img src="/merx-logo.png" alt="MERX" className="h-8" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>CAR</TableHead>
                <TableHead>Nome da Fazenda</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow 
                  key={report.car}
                  className="cursor-pointer hover:bg-[#F3F4F6]"
                >
                  <TableCell className="w-12">
                    <Checkbox
                      checked={selectedCars.includes(report.car)}
                      onCheckedChange={() => handleCheckboxChange(report.car)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell 
                    className="font-medium text-[#1F2937]"
                    onClick={() => handleReportClick(report.car)}
                  >
                    {report.car}
                  </TableCell>
                  <TableCell onClick={() => handleReportClick(report.car)}>{report.propertyName}</TableCell>
                  <TableCell onClick={() => handleReportClick(report.car)}>{new Date(report.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell onClick={() => handleReportClick(report.car)}>{report.state}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
};

export default Reports;
