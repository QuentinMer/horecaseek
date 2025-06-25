"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

interface Spot {
  id: string;
  name?: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface LeafletMapProps {
  spots: Spot[];
  center: [number, number];
  zoom: number;
  selectedSpot?: Spot | null;
}

// Fix des icônes Leaflet
const icon = L.icon({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

L.Marker.prototype.options.icon = icon;

function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);

  return null;
}

export default function LeafletMap({
  spots,
  center,
  zoom,
  selectedSpot,
}: LeafletMapProps) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full rounded">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.latitude, spot.longitude]}
        >
          <Popup>
            {spot.name && <strong>{spot.name}</strong>}
            <br />
            {spot.description}
          </Popup>
        </Marker>
      ))}
      <ChangeMapView center={center} />
    </MapContainer>
  );
}