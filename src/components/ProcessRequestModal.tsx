
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MapView from '@/components/MapView';
import { toast } from 'sonner';

interface ProcessRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProcessRequestModal = ({ open, onOpenChange }: ProcessRequestModalProps) => {
  const [areaName, setAreaName] = useState('');
  const [cropType, setCropType] = useState('');
  const [season, setSeason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!areaName || !cropType || !season) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulando processamento
    setTimeout(() => {
      toast.success('Solicitação de processamento enviada com sucesso!');
      toast.info('Você receberá um email quando o relatório estiver pronto.');
      setIsProcessing(false);
      onOpenChange(false);
      
      // Reset form
      setAreaName('');
      setCropType('');
      setSeason('');
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-white">
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
          
          <div className="rounded-md overflow-hidden border">
            <MapView isInModal={true} />
          </div>
          
          <DialogFooter>
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
