
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Report {
  car: string;
  propertyName: string;
  date: string;
  state: string;
}

const Reports = () => {
  const navigate = useNavigate();
  
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/6cbc2bc4-80af-4178-a42d-1b3be3dca26c.png" alt="Logo" className="h-8" />
            <h1 className="text-2xl font-semibold text-[#064C9F]">Histórico de Relatórios</h1>
          </div>
          <img src="/merx-logo.png" alt="MERX" className="h-8" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
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
                  onClick={() => handleReportClick(report.car)}
                  className="cursor-pointer hover:bg-[#F3F4F6]"
                >
                  <TableCell className="font-medium text-[#1F2937]">{report.car}</TableCell>
                  <TableCell>{report.propertyName}</TableCell>
                  <TableCell>{new Date(report.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{report.state}</TableCell>
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
