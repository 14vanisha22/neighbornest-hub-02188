import { useEffect, useState } from "react";
import { MapPin, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MedicalCenter {
  id: string;
  name: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
  contact: string;
  timings?: string;
  specialization?: string;
}

interface MedicalCentersMapProps {
  centers: MedicalCenter[];
}

export const MedicalCentersMap = ({ centers }: MedicalCentersMapProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [leafletMap, setLeafletMap] = useState<any>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLocationError("");
        },
        (error) => {
          setLocationError("Unable to get your location. Please enable GPS.");
          console.error("Geolocation error:", error);
          // Default to first medical center or a default location
          if (centers.length > 0 && centers[0].latitude && centers[0].longitude) {
            setUserLocation([centers[0].latitude, centers[0].longitude]);
          } else {
            setUserLocation([12.9716, 77.5946]); // Default to Bangalore
          }
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      if (centers.length > 0 && centers[0].latitude && centers[0].longitude) {
        setUserLocation([centers[0].latitude, centers[0].longitude]);
      } else {
        setUserLocation([12.9716, 77.5946]);
      }
    }
  }, [centers]);

  useEffect(() => {
    if (!userLocation || mapLoaded) return;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      const mapContainer = document.getElementById('medical-map');
      if (!mapContainer) return;

      // Initialize map
      const map = L.map('medical-map').setView(userLocation, 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Custom icon setup
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      // Add user location marker
      if (!locationError) {
        L.marker(userLocation, { icon: DefaultIcon })
          .addTo(map)
          .bindPopup('<div class="text-center"><strong>📍 You are here</strong></div>')
          .openPopup();
      }

      // Add medical center markers
      centers
        .filter((center) => center.latitude && center.longitude)
        .forEach((center) => {
          const marker = L.marker([center.latitude, center.longitude], { icon: DefaultIcon })
            .addTo(map);

          const popupContent = `
            <div style="padding: 8px; max-width: 300px;">
              <h3 style="font-weight: bold; font-size: 1.125rem; margin-bottom: 8px;">${center.name}</h3>
              <span style="display: inline-block; padding: 2px 8px; background-color: #f3f4f6; border-radius: 4px; font-size: 0.875rem; margin-bottom: 8px;">${center.type}</span>
              
              <div style="margin-top: 8px; font-size: 0.875rem;">
                <div style="display: flex; gap: 4px; margin-bottom: 4px;">
                  <span>📍</span>
                  <span>${center.address}</span>
                </div>
                
                ${center.timings ? `
                  <div style="margin-top: 4px;">
                    <strong>🕒 Timings:</strong> ${center.timings}
                  </div>
                ` : ''}
                
                ${center.specialization ? `
                  <div style="margin-top: 4px;">
                    <strong>🏥 Specialization:</strong> ${center.specialization}
                  </div>
                ` : ''}
              </div>

              <div style="display: flex; gap: 8px; margin-top: 12px;">
                <a href="tel:${center.contact}" style="flex: 1; text-decoration: none;">
                  <button style="width: 100%; padding: 6px 12px; background-color: hsl(var(--primary)); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
                    📞 Call
                  </button>
                </a>
                <button 
                  onclick="(function() { const url = 'https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}'; window.open(url, '_blank', 'noopener,noreferrer'); })()"
                  style="flex: 1; padding: 6px 12px; background-color: white; color: hsl(var(--primary)); border: 1px solid hsl(var(--border)); border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
                  🧭 Navigate
                </button>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);
        });

      setLeafletMap(map);
      setMapLoaded(true);
    });

    return () => {
      if (leafletMap) {
        leafletMap.remove();
      }
    };
  }, [userLocation, centers, locationError, mapLoaded, leafletMap]);

  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {locationError && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          {locationError}
        </div>
      )}
      
      <div id="medical-map" className="h-[600px] rounded-lg overflow-hidden border shadow-lg"></div>
    </div>
  );
};
