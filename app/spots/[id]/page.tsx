"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";
import Image from "next/image";

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

export default function SpotDetailPage() {
  const supabase = createClient();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchSpot() {
      setLoading(true);
      const { data, error } = await supabase.from("spots").select("*").eq("id", id).single();
      if (error) {
        setError(error.message);
      } else {
        setSpot(data);
      }
      setLoading(false);
    }

    fetchSpot();
  }, [id, supabase]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">Erreur : {error}</p>;
  if (!spot) return <p>Spot introuvable.</p>;

  const avgVote = spot.votes_count > 0 ? (spot.votes_sum / spot.votes_count).toFixed(1) : "N/A";

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col gap-4">
      <h1 className="text-3xl font-bold">{spot.name}</h1>
      <p className="italic text-gray-600">{spot.description}</p>

      {spot.image_urls && spot.image_urls.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {spot.image_urls.map((url, i) => (
            <Image
              key={i}
              src={url}
              alt={`Spot ${i + 1}`}
              width={192}  // équivalent de w-48
              height={128} // équivalent de h-32
              className="rounded object-cover"
              unoptimized
            />
          ))}
        </div>
      )}

      <p>Localisation : {spot.latitude.toFixed(5)}, {spot.longitude.toFixed(5)}</p>
      <p>
        Note moyenne : <strong>{avgVote}</strong> / 5 ({spot.votes_count} vote{spot.votes_count > 1 ? "s" : ""})
      </p>

      <div className="w-full" style={{ height: "300px" }}>
        <LeafletMap spots={[spot]} center={[spot.latitude, spot.longitude]} zoom={14} />
      </div>
    </div>
  );
}