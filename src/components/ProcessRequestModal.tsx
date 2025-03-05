import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MapView from '@/components/MapView';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface ProcessRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface GeometryData {
  type: string;
  coordinates: Array<any>;
}

const ProcessRequestModal = ({ open, onOpenChange }: ProcessRequestModalProps) => {
  const [areaName, setAreaName] = useState('');
  const [cropType, setCropType] = useState('');
  const [season, setSeason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [kmlFile, setKmlFile] = useState<File | null>(null);
  const [drawnGeometry, setDrawnGeometry] = useState<GeometryData | null>(null);

  const handleKmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.kml')) {
        setKmlFile(file);
        setDrawnGeometry(null); // Limpar geometria desenhada quando KML é carregado
        toast.success(`Arquivo KML "${file.name}" carregado com sucesso`);
      } else {
        toast.error('Por favor, selecione um arquivo KML válido');
        e.target.value = '';
      }
    }
  };

  const handleGeometryDrawn = (geometry: GeometryData) => {
    setDrawnGeometry(geometry);
    setKmlFile(null); // Limpar KML quando geometria é desenhada
    toast.success('Geometria desenhada com sucesso');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!areaName || !cropType || !season) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (!kmlFile && !drawnGeometry) {
      toast.error('Por favor, desenhe uma área no mapa ou carregue um arquivo KML');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('areaName', areaName);
      formData.append('cropType', cropType);
      formData.append('season', season);
      formData.append('requestDate', new Date().toISOString());
      
      if (kmlFile) {
        formData.append('kmlFile', kmlFile);
        formData.append('geometrySource', 'kml');
      } 
      else if (drawnGeometry) {
        formData.append('geometry', JSON.stringify(drawnGeometry));
        formData.append('geometrySource', 'drawn');
      }
      
      const response = await fetch('http://localhost:8000/api/process-request', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        
        toast.success('Solicitação de processamento enviada com sucesso!');
        toast.info('Você receberá um email quando o relatório estiver pronto.');
        
        onOpenChange(false);
        setAreaName('');
        setCropType('');
        setSeason('');
        setKmlFile(null);
        setDrawnGeometry(null);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro ao processar a solicitação' }));
        toast.error(errorData.message || 'Erro ao enviar a solicitação de processamento');
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      toast.error('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitar Processamento de Área</DialogTitle>
          <DialogDescription>
            Cadastre a área, defina a cultura e o período para análise.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="areaName" className="text-sm font-medium">Nome da Área</label>
            <Input 
              id="areaName"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              placeholder="Ex: Fazenda São João - Talhão 3"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="cropType" className="text-sm font-medium">Cultura</label>
              <Select value={cropType} onValueChange={setCropType}>
                <SelectTrigger id="cropType">
                  <SelectValue placeholder="Selecione a cultura" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="soja">Soja</SelectItem>
                  <SelectItem value="milho">Milho</SelectItem>
                  <SelectItem value="algodao">Algodão</SelectItem>
                  <SelectItem value="cana">Cana-de-açúcar</SelectItem>
                  <SelectItem value="trigo">Trigo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="season" className="text-sm font-medium">Período</label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger id="season">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="safra">Safra</SelectItem>
                  <SelectItem value="safrinha">Safrinha</SelectItem>
                  <SelectItem value="inverno">Cultura de Inverno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Arquivo KML (opcional)</label>
            <div className="flex items-center gap-2">
              <label 
                htmlFor="kmlUpload" 
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
              >
                <Upload className="h-4 w-4" />
                {kmlFile ? 'Trocar arquivo' : 'Carregar KML'}
              </label>
              <input
                id="kmlUpload"
                type="file"
                accept=".kml"
                onChange={handleKmlUpload}
                className="hidden"
              />
              {kmlFile && (
                <span className="text-sm text-gray-600 truncate max-w-[200px]">
                  {kmlFile.name}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Ou desenhe uma área diretamente no mapa abaixo
            </p>
          </div>
          
          <div className="rounded-md overflow-hidden border">
            <MapView isInModal={true} onGeometryDrawn={handleGeometryDrawn} />
          </div>
          
          <DialogFooter className="sticky bottom-0 pt-2 bg-white border-t mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processando...' : 'Solicitar Processamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessRequestModal;
