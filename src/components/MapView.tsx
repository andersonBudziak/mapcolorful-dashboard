import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import KML from 'ol/format/KML';
import { Fill, Stroke, Style } from 'ol/style';
import Draw from 'ol/interaction/Draw';
import { toast } from 'sonner';
import propertyExample from '../../api-docs/examples/property.json';
import 'ol/ol.css';
import ProcessRequestModal from './ProcessRequestModal';

interface MapViewProps {
  carFilter?: string;
  isInModal?: boolean;
  onGeometryDrawn?: (geometry: any) => void;
}

const MapView = ({ carFilter, isInModal = false, onGeometryDrawn }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const drawInteraction = useRef<Draw | null>(null);
  const kmlLayerSource = useRef<VectorSource | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const { data: properties, isLoading, error } = useQuery({
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

  const startDrawing = () => {
    if (!mapInstance.current) return;
    
    if (drawInteraction.current) {
      mapInstance.current.removeInteraction(drawInteraction.current);
      drawInteraction.current = null;
      setIsDrawing(false);
      return;
    }

    const source = new VectorSource();
    const layer = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(100, 149, 237, 0.3)',
        }),
        stroke: new Stroke({
          color: '#6495ED',
          width: 2,
        }),
      }),
    });
    
    mapInstance.current.addLayer(layer);
    
    drawInteraction.current = new Draw({
      source: source,
      type: 'Polygon',
    });
    
    drawInteraction.current.on('drawend', (event) => {
      const feature = event.feature;
      const geometry = feature.getGeometry();
      
      if (geometry) {
        const format = new GeoJSON();
        const geoJSON = JSON.parse(format.writeGeometry(geometry));
        
        if (onGeometryDrawn && isInModal) {
          onGeometryDrawn(geoJSON);
        }
        
        toast.success('Área desenhada com sucesso!');
      }
    });
    
    mapInstance.current.addInteraction(drawInteraction.current);
    setIsDrawing(true);
    toast.info('Desenhe uma área no mapa para cadastrar');
  };

  const handleKmlUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.kml';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const fileContent = await file.text();
        const kmlFormat = new KML();
        const features = kmlFormat.readFeatures(fileContent, {
          featureProjection: 'EPSG:3857',
        });
        
        if (features.length === 0) {
          toast.error('Arquivo KML não contém geometrias válidas');
          return;
        }
        
        if (!kmlLayerSource.current) {
          kmlLayerSource.current = new VectorSource();
          
          const kmlLayer = new VectorLayer({
            source: kmlLayerSource.current,
            style: new Style({
              fill: new Fill({
                color: 'rgba(100, 149, 237, 0.3)',
              }),
              stroke: new Stroke({
                color: '#6495ED',
                width: 2,
              }),
            }),
          });
          
          if (mapInstance.current) {
            mapInstance.current.addLayer(kmlLayer);
          }
        } else {
          kmlLayerSource.current.clear();
        }
        
        kmlLayerSource.current.addFeatures(features);
        
        if (mapInstance.current && kmlLayerSource.current) {
          const extent = kmlLayerSource.current.getExtent();
          mapInstance.current.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            maxZoom: 14,
          });
        }
        
        toast.success('Arquivo KML carregado com sucesso!');
      } catch (error) {
        console.error('Erro ao processar arquivo KML:', error);
        toast.error('Erro ao processar o arquivo KML');
      }
    };
    
    input.click();
  };

  useEffect(() => {
    if (!mapRef.current || isLoading || error || !properties) return;

    const filteredProperties = carFilter 
      ? properties.filter(property => property.id === carFilter)
      : properties;

    const features = {
      type: 'FeatureCollection',
      features: filteredProperties.map(property => ({
        type: 'Feature',
        geometry: property.geometry,
        properties: {
          property_id: property.id,
          name: property.name
        }
      }))
    };

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(features, {
        featureProjection: 'EPSG:3857'
      })
    });

    const polygonStyle = new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)',
      }),
      stroke: new Stroke({
        color: '#FFFFFF',
        width: 2,
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: polygonStyle,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attributions: 'Tiles © <a href="https://www.esri.com">ESRI</a>',
            maxZoom: 19
          })
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([-55.7148, -12.5452]),
        zoom: 12
      })
    });

    mapInstance.current = map;

    if (isInModal) {
      setTimeout(() => {
        startDrawing();
      }, 500);
    } else {
      map.on('click', (event) => {
        const feature = map.forEachFeatureAtPixel(event.pixel, function(feature) {
          return feature;
        });
        
        if (feature) {
          const propertyId = feature.get('property_id');
          if (propertyId && !carFilter) {
            navigate(`/report/${propertyId}`);
          }
        }
      });

      map.on('pointermove', function(e) {
        const pixel = map.getEventPixel(e.originalEvent);
        const hit = map.hasFeatureAtPixel(pixel);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
      });
    }

    if (vectorSource.getFeatures().length > 0) {
      const extent = vectorSource.getExtent();
      map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        maxZoom: 14
      });
    }

    if (error) {
      toast.error("Erro ao carregar dados do mapa");
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
      mapInstance.current = null;
      if (drawInteraction.current) {
        drawInteraction.current = null;
      }
    };
  }, [carFilter, navigate, properties, isLoading, error, isInModal, onGeometryDrawn]);

  if (isLoading) {
    return (
      <div className="rounded-lg overflow-hidden shadow-md">
        <div className="h-[400px] w-full flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-merx-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg overflow-hidden shadow-md">
        <div className="h-[400px] w-full flex items-center justify-center bg-gray-100">
          <p className="text-red-500">Erro ao carregar o mapa</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg overflow-hidden shadow-md relative">
        <div ref={mapRef} className={`${isInModal ? 'h-[300px]' : 'h-[400px]'} w-full`} />
        
        {!isInModal && (
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="secondary"
              className="flex items-center gap-2 bg-white text-[#064C9F] hover:bg-[#F3F4F6]"
              size="sm"
            >
              <FilePlus className="h-4 w-4" />
              Solicitar Processamento
            </Button>
          </div>
        )}
        
        {isInModal && !isDrawing && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              onClick={handleKmlUpload}
              variant="secondary"
              className="flex items-center gap-2 bg-white text-[#064C9F] hover:bg-[#F3F4F6]"
              size="sm"
            >
              <FilePlus className="h-4 w-4" />
              Inserir KML
            </Button>
            
            <Button
              onClick={startDrawing}
              variant="secondary"
              className="flex items-center gap-2 bg-white text-[#064C9F] hover:bg-[#F3F4F6]"
              size="sm"
            >
              Desenhar Área
            </Button>
          </div>
        )}
        
        {isInModal && isDrawing && (
          <div className="absolute top-4 right-4">
            <Button
              onClick={startDrawing}
              variant="secondary"
              className="flex items-center gap-2 bg-[#064C9F] text-white hover:bg-[#053a79]"
              size="sm"
            >
              Cancelar Desenho
            </Button>
          </div>
        )}
      </div>
      
      {!isInModal && (
        <ProcessRequestModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen} 
        />
      )}
    </>
  );
};

export default MapView;
