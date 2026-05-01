'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Restaurant } from '../types';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface MapComponentProps {
  restaurants: Restaurant[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}

export default function MapComponent({ 
  restaurants, 
  height = '400px', 
  center = [9.0765, 7.3986],
  zoom = 13
}: MapComponentProps) {
  const [L, setL] = useState<any>(null);
  const [MapIcon, setMapIcon] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      
      // Create custom icon
      const icon = leaflet.default.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      setMapIcon(() => icon);
    });
  }, []);

  if (!L || !MapIcon || restaurants.length === 0) {
    return (
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center" style={{ height }}>
        <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%' }}
      className="rounded-lg z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={[restaurant.latitude, restaurant.longitude]}
          icon={MapIcon}
        >
          <Popup>
            <div className="p-3 min-w-[200px]">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                {restaurant.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{restaurant.address}</p>
              <div className="flex gap-2">
                <a
                  href={`/restaurants/${restaurant.id}`}
                  className="inline-block text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Details →
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}