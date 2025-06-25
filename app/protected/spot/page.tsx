"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/leafletMap"), { ssr: false });

interface Spot {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image_urls: string[];
  votes_sum: number;
  votes_count: number;
}

export default function ProtectedSpotPage() {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tous les spots</h1>
        <Link href="/protected/spot/new" className="text-blue-600 hover:underline mb-4">
          Ajouter un spot
        </Link>
      </div>

      <ul className="flex flex-col gap-6">
        {spots.map((spot) => {
          const avgVote = spot.votes_count > 0 ? (spot.votes_sum / spot.votes_count).toFixed(1) : "N/A";
          return (
            <li key={spot.id} className="border rounded p-4 shadow-md flex flex-col gap-3">
              <h2 className="text-xl font-bold">{spot.name}</h2>
              <p className="italic">{spot.description}</p>

              {spot.image_urls && spot.image_urls.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {spot.image_urls.map((url) => (
                    <Image
                      key={url}
                      src={url}
                      alt={`Spot image`}
                      width={320}
                      height={240}
                      className="rounded object-cover"
                      unoptimized
                    />
                  ))}
                </div>
              )}

              <p>
                Localisation : {spot.latitude.toFixed(5)}, {spot.longitude.toFixed(5)}
              </p>
              <p>
                Note moyenne : <span className="font-semibold">{avgVote}</span> / 5 (
                {spot.votes_count} vote{spot.votes_count > 1 ? "s" : ""})
              </p>

              <div style={{ height: "200px", width: "100%" }}>
                <LeafletMap spots={[spot]} center={[spot.latitude, spot.longitude]} zoom={14} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}