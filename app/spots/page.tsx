"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import LeafletMap from "@/components/leafletMap";

interface Spot {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  image_urls: string[];
  votes_sum: number;
  votes_count: number;
}

export default function SpotsPage() {
  const supabase = createClient();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Liste des spots</h1>
      <ul className="flex flex-col gap-6 mb-8">
        {spots.map((spot) => {
          const avgVote =
            spot.votes_count > 0 ? (spot.votes_sum / spot.votes_count).toFixed(1) : "N/A";

          return (
            <li key={spot.id} className="border rounded p-4 shadow-md flex flex-col gap-3">
              <p className="italic text-gray-600">{spot.description}</p>
              {spot.image_urls && spot.image_urls.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {spot.image_urls.map((imageUrl, i) => (
                    <Image
                      key={i}
                      src={imageUrl}
                      alt={`Spot image ${i + 1}`}
                      width={320}
                      height={240}
                      className="rounded object-cover"
                      unoptimized
                    />
                  ))}
                </div>
              )}
              <p>Localisation : {spot.latitude.toFixed(5)}, {spot.longitude.toFixed(5)}</p>
              <p>
                Note moyenne :{" "}
                <span className="font-semibold">{avgVote}</span> / 5 (
                {spot.votes_count} vote{spot.votes_count > 1 ? "s" : ""})
              </p>

              <LeafletMap spots={[spot]} center={[spot.latitude, spot.longitude]} zoom={15} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}