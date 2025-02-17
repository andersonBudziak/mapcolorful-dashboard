
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { toast } from 'sonner';
import 'ol/ol.css';
import geoJsonExample from '../../api-docs/examples/geojson.json';

interface MapViewProps {
  carFilter?: string;
}

const fetchMapData = async () => {
  return geoJsonExample;
};

const getColorByTalhao = (talhao: number) => {
  const colors = {
    1: 'rgba(0, 155, 77, 0.3)',  // Verde MERX
    2: 'rgba(255, 193, 7, 0.3)',  // Amarelo
    3: 'rgba(220, 53, 69, 0.3)'   // Vermelho
  };
  return colors[talhao as keyof typeof colors] || 'rgba(0, 155, 77, 0.3)';
};

const MapView = ({ carFilter }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { data: geoJsonData, isLoading, error } = useQuery({
    queryKey: ['mapData'],
    queryFn: fetchMapData,
  });

  useEffect(() => {
    if (!mapRef.current || isLoading || error) return;

    const filteredFeatures = carFilter 
      ? {
          ...geoJsonData,
          features: geoJsonData.features.filter((feature: any) => 
            feature.properties.cod_imovel === carFilter
          )
        }
      : geoJsonData;

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(filteredFeatures, {
        featureProjection: 'EPSG:3857',
        dataProjection: 'EPSG:4674' // SIRGAS 2000
      })
    });

    // Estilo personalizado para cada talhão
    const styleFunction = (feature: any) => {
      const talhao = feature.get('talhao');
      const rotulo = feature.get('rotulo');
      
      return new Style({
        fill: new Fill({
          color: getColorByTalhao(talhao)
        }),
        stroke: new Stroke({
          color: '#009B4D',
          width: 2,
        }),
        text: new Text({
          text: rotulo?.toString() || '',
          fill: new Fill({
            color: '#000000'
          }),
          stroke: new Stroke({
            color: '#FFFFFF',
            width: 2
          }),
          font: '14px Inter',
          offsetY: -15
        })
      });
    };

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
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
        center: fromLonLat([-49.757, -10.787]),
        zoom: 14
      })
    });

    map.on('click', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, function(feature) {
        return feature;
      });
      
      if (feature) {
        const properties = feature.getProperties();
        toast.info(`
          Talhão: ${properties.talhao}
          Área: ${properties['area(ha)']} ha
          Cultura: ${properties.Cultura}
          Plantio: ${properties.plantio}
          Colheita: ${properties.colheita}
        `);
        
        if (!carFilter && properties.cod_imovel) {
          navigate(`/report/${properties.cod_imovel}`);
        }
      }
    });

    map.on('pointermove', function(e) {
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    if (vectorSource.getFeatures().length > 0) {
      const extent = vectorSource.getExtent();
      map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        maxZoom: 16
      });
    }

    if (error) {
      toast.error("Erro ao carregar dados do mapa");
    }

    return () => map.setTarget(undefined);
  }, [carFilter, navigate, geoJsonData, isLoading, error]);

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
    <div className="rounded-lg overflow-hidden shadow-md">
      <div ref={mapRef} className="h-[400px] w-full" />
    </div>
  );
};

export default MapView;
