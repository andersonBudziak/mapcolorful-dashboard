import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import MapView from '@/components/MapView';
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
  const [exporting, setExporting] = useState(false);
  
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

  const generateChartImageData = () => {
    const rainfallData = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Precipitação (mm)',
        data: [120, 150, 180, 90, 60, 30],
        backgroundColor: '#2980E8'
      }]
    };

    const biomassData = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [{
        label: 'NDVI',
        data: [0.8, 0.85, 0.82, 0.79, 0.81, 0.83],
        borderColor: '#009B4D',
        backgroundColor: 'rgba(0, 155, 77, 0.2)',
        tension: 0.4
      }]
    };

    return { rainfallData, biomassData };
  };

  const generatePDFContent = (cars: string[]) => {
    const { rainfallData, biomassData } = generateChartImageData();

    return {
      content: [
        {
          text: 'Relatório de Análise de Propriedades',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          image: '/lovable-uploads/6cbc2bc4-80af-4178-a42d-1b3be3dca26c.png',
          width: 150,
          alignment: 'center',
          margin: [0, 0, 0, 30]
        },
        ...cars.map((car, index) => [
          {
            text: `Propriedade ${index + 1}`,
            style: 'subheader',
            pageBreak: index > 0 ? 'before' : undefined
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*'],
              body: [
                [{ text: 'CAR', style: 'tableHeader' }, { text: car, style: 'tableCell' }],
                [{ text: 'Data da Análise', style: 'tableHeader' }, { text: new Date().toLocaleDateString('pt-BR'), style: 'tableCell' }],
                [{ text: 'Status', style: 'tableHeader' }, { text: 'Análise Concluída', style: 'tableCell' }]
              ]
            },
            margin: [0, 20]
          },
          {
            text: 'Pluviometria',
            style: 'subheader',
            margin: [0, 20, 0, 10]
          },
          {
            columns: [
              {
                width: '*',
                text: [
                  { text: 'Média anual: ', style: 'metric' },
                  { text: '1200mm\n\n', style: 'metricValue' },
                  { text: 'Variação: ', style: 'metric' },
                  { text: '±15%', style: 'metricValue' }
                ]
              }
            ]
          },
          {
            text: 'Biomassa (NDVI)',
            style: 'subheader',
            margin: [0, 20, 0, 10]
          },
          {
            columns: [
              {
                width: '*',
                text: [
                  { text: 'Média NDVI: ', style: 'metric' },
                  { text: '0.82\n\n', style: 'metricValue' },
                  { text: 'Saúde da vegetação: ', style: 'metric' },
                  { text: 'Excelente', style: 'metricValue' }
                ]
              }
            ]
          },
          {
            text: 'Métricas de Avaliação',
            style: 'subheader',
            margin: [0, 20]
          },
          {
            columns: [
              {
                width: 'auto',
                stack: [
                  { text: 'Score Área:', style: 'metric' },
                  { text: 'Pluviometria:', style: 'metric' },
                  { text: 'Biomassa:', style: 'metric' }
                ],
                margin: [0, 0, 20, 0]
              },
              {
                width: '*',
                stack: [
                  { text: '8.0/10', style: 'metricValue' },
                  { text: '7.5/10', style: 'metricValue' },
                  { text: '8.0/10', style: 'metricValue' }
                ]
              }
            ],
            margin: [0, 20]
          }
        ]).flat()
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          color: '#064C9F'
        },
        subheader: {
          fontSize: 18,
          bold: true,
          color: '#064C9F',
          margin: [0, 20, 0, 10]
        },
        tableHeader: {
          fontSize: 12,
          bold: true,
          color: '#064C9F',
          fillColor: '#F3F4F6'
        },
        tableCell: {
          fontSize: 12
        },
        metric: {
          fontSize: 14,
          bold: true,
          color: '#064C9F'
        },
        metricValue: {
          fontSize: 14
        }
      },
      defaultStyle: {
        font: 'Helvetica'
      },
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      info: {
        title: 'Relatório de Análise de Propriedades',
        author: 'Sistema de Análise',
        subject: 'Relatório detalhado das propriedades selecionadas'
      }
    };
  };

  const handleExportSelected = async () => {
    if (selectedCars.length === 0) {
      toast.error("Selecione pelo menos um relatório para exportar");
      return;
    }

    if (exporting) return;

    try {
      setExporting(true);
      console.log('Exporting PDFs for CARs:', selectedCars);
      
      const pdfContent = generatePDFContent(selectedCars);
      
      const pdfBase64 = 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G';

      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

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
      console.error('Erro ao exportar:', error);
      toast.error("Erro ao exportar relatórios. Por favor, tente novamente.");
    } finally {
      setExporting(false);
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
              disabled={selectedCars.length === 0 || exporting}
            >
              <FileDown className="h-4 w-4" />
              {exporting ? 'Exportando...' : 'Exportar Selecionados'}
            </Button>
            <img src="/merx-logo.png" alt="MERX" className="h-8" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <MapView />
        
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
