
import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import { Fill, Stroke, Style } from 'ol/style';
import 'ol/ol.css';

const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;

    // Criar algumas geometrias fake para teste
    const fakeGeometries = [
      // Polígono 1 - área maior
      [[
        [-45.6789, -12.3456],
        [-45.6589, -12.3456],
        [-45.6589, -12.3256],
        [-45.6789, -12.3256],
        [-45.6789, -12.3456],
      ]],
      // Polígono 2 - área menor próxima
      [[
        [-45.6889, -12.3556],
        [-45.6789, -12.3556],
        [-45.6789, -12.3456],
        [-45.6889, -12.3456],
        [-45.6889, -12.3556],
      ]],
      // Polígono 3 - área em outro local
      [[
        [-45.7089, -12.3756],
        [-45.6989, -12.3756],
        [-45.6989, -12.3656],
        [-45.7089, -12.3656],
        [-45.7089, -12.3756],
      ]]
    ];

    // Criar features para cada geometria
    const features = fakeGeometries.map(coords => {
      const polygon = new Polygon([coords[0].map(coord => fromLonLat(coord))]);
      return new Feature({
        geometry: polygon,
      });
    });

    // Estilo para os polígonos
    const polygonStyle = new Style({
      fill: new Fill({
        color: 'rgba(100, 149, 237, 0.3)', // Azul claro semi-transparente
      }),
      stroke: new Stroke({
        color: '#064C9F',
        width: 2,
      }),
    });

    // Criar source e layer vetorial
    const vectorSource = new VectorSource({
      features: features,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: polygonStyle,
    });

    // Criar o mapa
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([-45.6789, -12.3456]),
        zoom: 12
      })
    });

    // Ajustar o zoom para mostrar todas as geometrias
    const extent = vectorSource.getExtent();
    map.getView().fit(extent, {
      padding: [50, 50, 50, 50],
      maxZoom: 14
    });

    return () => map.setTarget(undefined);
  }, []);

  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      <div ref={mapRef} className="h-[400px] w-full" />
    </div>
  );
};

export default MapView;
