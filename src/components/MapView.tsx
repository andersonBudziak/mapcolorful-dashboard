
import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';

const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([-45.6789, -12.3456]),
        zoom: 12
      })
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
