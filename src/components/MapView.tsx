
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
import { Fill, Stroke, Style } from 'ol/style';
import { toast } from 'sonner';
import 'ol/ol.css';
import geoJsonExample from '../../api-docs/examples/geojson.json';

interface MapViewProps {
  carFilter?: string;
}

const fetchMapData = async () => {
  // Temporariamente usando dados de exemplo
  return geoJsonExample;
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

    // Filtrar features se houver um CAR específico
    const filteredFeatures = carFilter 
      ? {
          ...geoJsonData,
          features: geoJsonData.features.filter((feature: any) => 
            feature.properties.property_id === carFilter
          )
        }
      : geoJsonData;

    // Criar source e layer vetorial
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(filteredFeatures, {
        featureProjection: 'EPSG:3857'
      })
    });

    // Estilo para os polígonos
    const polygonStyle = new Style({
      fill: new Fill({
        color: 'rgba(0, 155, 77, 0.3)', // Verde MERX com transparência
      }),
      stroke: new Stroke({
        color: '#009B4D', // Verde MERX
        width: 2,
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: polygonStyle,
    });

    // Criar o mapa com camada base ESRI
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
        center: fromLonLat([-45.6789, -12.3456]),
        zoom: 12
      })
    });

    // Adicionar interatividade ao clicar nas geometrias
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

    // Mudar o cursor ao passar sobre as geometrias
    map.on('pointermove', function(e) {
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    // Ajustar o zoom para mostrar todas as geometrias
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
