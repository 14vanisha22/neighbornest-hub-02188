import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';

// Fix for default marker icons in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Kitchen {
  id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  is_free: boolean;
  timings: string;
  rating: number;
  status?: string;
}

interface FoodBank {
  id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  timings: string;
}

interface KitchenMapViewProps {
  kitchens: Kitchen[];
  foodBanks: FoodBank[];
  onMarkerClick?: (type: 'kitchen' | 'bank', id: string) => void;
}

export const KitchenMapView = ({ kitchens, foodBanks, onMarkerClick }: KitchenMapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  const getMarkerColor = (kitchen: Kitchen) => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Simple check if open (this is a basic implementation)
    // In a real app, you'd parse timings properly
    if (kitchen.timings.toLowerCase().includes('24')) return 'green';
    if (currentHour >= 7 && currentHour <= 21) return 'green';
    if (currentHour >= 21 && currentHour <= 23) return 'orange';
    return 'red';
  };

  const createCustomIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          background: ${color === 'green' ? '#22c55e' : color === 'orange' ? '#f97316' : '#ef4444'};
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="transform: rotate(45deg); color: white; font-weight: bold;">🍽️</span>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };

  const createBankIcon = () => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          background: #3b82f6;
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="transform: rotate(45deg); color: white; font-weight: bold;">🏦</span>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map centered on Vizag (example coordinates)
    map.current = L.map(mapContainer.current).setView([17.6868, 83.2185], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current?.removeLayer(layer);
      }
    });

    // Add kitchen markers
    kitchens.forEach((kitchen) => {
      if (kitchen.latitude && kitchen.longitude) {
        const color = getMarkerColor(kitchen);
        const marker = L.marker([kitchen.latitude, kitchen.longitude], {
          icon: createCustomIcon(color)
        }).addTo(map.current!);

        const statusText = color === 'green' ? '🟢 Open now' : color === 'orange' ? '🟠 Closes soon' : '🔴 Closed';
        
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px;">${kitchen.name}</h3>
            <p style="margin: 4px 0;">${statusText}</p>
            <p style="margin: 4px 0;"><strong>Timings:</strong> ${kitchen.timings}</p>
            <p style="margin: 4px 0;"><strong>Type:</strong> ${kitchen.is_free ? 'Free meals' : 'Affordable'}</p>
            <p style="margin: 4px 0;">⭐ ${kitchen.rating.toFixed(1)}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">${kitchen.location}</p>
          </div>
        `);

        marker.on('click', () => {
          onMarkerClick?.('kitchen', kitchen.id);
        });
      }
    });

    // Add food bank markers
    foodBanks.forEach((bank) => {
      if (bank.latitude && bank.longitude) {
        const marker = L.marker([bank.latitude, bank.longitude], {
          icon: createBankIcon()
        }).addTo(map.current!);

        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px;">${bank.name}</h3>
            <p style="margin: 4px 0;"><strong>Timings:</strong> ${bank.timings}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">${bank.location}</p>
          </div>
        `);

        marker.on('click', () => {
          onMarkerClick?.('bank', bank.id);
        });
      }
    });

    // Fit map to show all markers
    if (kitchens.length > 0 || foodBanks.length > 0) {
      const bounds = L.latLngBounds(
        [...kitchens, ...foodBanks]
          .filter(item => item.latitude && item.longitude)
          .map(item => [item.latitude, item.longitude] as [number, number])
      );
      map.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [kitchens, foodBanks, onMarkerClick]);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="bg-muted p-4 border-b">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Open now</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span>Closes soon</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Closed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Food Bank</span>
          </div>
        </div>
      </div>
      <div ref={mapContainer} className="h-[500px] w-full" />
    </Card>
  );
};