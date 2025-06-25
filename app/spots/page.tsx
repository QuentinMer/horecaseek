"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/leafletMap"), { ssr: false });

interface Spot {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

export default function SpotsPage() {
  const supabase = createClient();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [showMapMobile, setShowMapMobile] = useState(false);

  useEffect(() => {
    async function fetchSpots() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("spots")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
        setSpots([]);
      } else if (data) {
        setSpots(data);
      }
      setLoading(false);
    }
    fetchSpots();
  }, [supabase]);

  if (loading) return <p className="text-center mt-10">Chargement des spots...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">Erreur : {error}</p>;
  if (spots.length === 0) return <p className="text-center mt-10">Aucun spot trouvé.</p>;

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-screen">
      
      {/* Liste des spots */}
      <div className="flex-1 border-r overflow-y-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Liste des spots</h1>
        
        <ul className="flex flex-col gap-3">
          {spots.map((spot) => (
            <li
              key={spot.id}
              onClick={() => setSelectedSpot(spot)}
              className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${
                selectedSpot?.id === spot.id ? "bg-gray-200" : ""
              }`}
            >
              <h3 className="font-semibold">{spot.name}</h3>
              <p className="text-sm text-gray-600">{spot.description}</p>
            </li>
          ))}
        </ul>

        {/* Bouton d'affichage carte visible uniquement en mobile */}
        <div className="block md:hidden mt-4">
          <button
            onClick={() => setShowMapMobile(!showMapMobile)}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            {showMapMobile ? "Masquer la carte" : "Afficher la carte"}
          </button>
        </div>

        {/* Carte mobile */}
        {showMapMobile && (
          <div className="mt-4" style={{ width: "100%", height: "300px" }}>
            <LeafletMap
              spots={spots}
              selectedSpot={selectedSpot}
              center={
                selectedSpot
                  ? [selectedSpot.latitude, selectedSpot.longitude]
                  : [45.75, 4.85]
              }
              zoom={13}
            />
          </div>
        )}
      </div>

      {/* Carte desktop */}
      <div className="hidden md:block" style={{ width: "500px", height: "100%" }}>
        <LeafletMap
          spots={spots}
          selectedSpot={selectedSpot}
          center={
            selectedSpot
              ? [selectedSpot.latitude, selectedSpot.longitude]
              : [45.75, 4.85]
          }
          zoom={13}
        />
      </div>
    </div>
  );
}