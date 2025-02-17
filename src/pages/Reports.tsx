
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

  const generatePDFContent = (cars: string[]) => {
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
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: 515,
                h: 200,
                r: 4,
                lineWidth: 1,
                lineColor: '#064C9F'
              }
            ],
            margin: [0, 20]
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
      
      try {
        const pdfContent = generatePDFContent(selectedCars);
        const response = await fetch('http://localhost:8000/api/reports/batch-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cars: selectedCars,
            pdfContent
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        if (blob.type !== 'application/pdf') {
          throw new Error('Response is not a PDF');
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorios.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (apiError) {
        console.error('Error with API:', apiError);
        toast.error("Erro ao gerar PDF. Por favor, tente novamente.");
      }

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
