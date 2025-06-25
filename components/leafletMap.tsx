"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/assets/icons/custom-icons/marker-icon-2x.png",
  iconUrl: "/assets/icons/custom-icons/marker-icon.png",
  shadowUrl: "/assets/icons/custom-icons/marker-shadow.png",
});

interface Spot {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface LeafletMapProps {
  spots: Spot[];
  center: [number, number];
  zoom?: number;
}

export default function LeafletMap({ spots, center, zoom = 13 }: LeafletMapProps) {
  useEffect(() => {}, []);

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {spots.map((spot) => (
        <Marker key={spot.id} position={[spot.latitude, spot.longitude]}>
          <Popup>{spot.description}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}