"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Spot {
  id: string;
  user_id: string;
  description: string;
  latitude: number;
  longitude: number;
  image_urls: string[];
  votes_sum: number;
  votes_count: number;
}

export default function SpotDetail() {
  const supabase = createClient();
  const pathname = usePathname();

  const spotId = pathname.split("/").pop() || ""; // Extract id from URL

  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!spotId) return;

    const fetchSpot = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("spots")
        .select("*")
        .eq("id", spotId)
        .single();

      if (error) {
        setError(error.message);
        setSpot(null);
      } else {
        setSpot(data);
      }
      setLoading(false);
    };

    fetchSpot();
  }, [spotId, supabase]);

  const avgVote = spot && spot.votes_count > 0
    ? (spot.votes_sum / spot.votes_count).toFixed(1)
    : "N/A";

  const handleVote = async (vote: number) => {
    if (!spot) return;

    setSubmitting(true);
    setError(null);

    try {
      const newVotesSum = (spot.votes_sum || 0) + vote;
      const newVotesCount = (spot.votes_count || 0) + 1;

      const { error } = await supabase
        .from("spots")
        .update({ votes_sum: newVotesSum, votes_count: newVotesCount })
        .eq("id", spot.id);

      if (error) {
        setError(error.message);
      } else {
        setSpot({ ...spot, votes_sum: newVotesSum, votes_count: newVotesCount });
        setUserVote(vote);
      }
    } catch {
      setError("Erreur lors de l’enregistrement du vote");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Chargement du spot...</p>;
  if (error) return <p className="text-red-600">Erreur : {error}</p>;
  if (!spot) return <p>Spot non trouvé.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Détail du spot</h1>

      <p className="mb-4 italic text-gray-700">{spot.description}</p>

      {spot.image_urls.length > 0 && (
        <div className="flex gap-4 overflow-x-auto mb-4">
          {spot.image_urls.map((url, i) => (
            <Image
              key={i}
              src={url}
              alt={`Spot image ${i + 1}`}
              width={160}
              height={160}
              className="rounded object-cover"
              unoptimized
            />
          ))}
        </div>
      )}

      <p className="mb-2">
        Localisation : {spot.latitude.toFixed(5)}, {spot.longitude.toFixed(5)}
      </p>

      <p className="mb-4">
        Note moyenne : <strong>{avgVote}</strong> / 5 ({spot.votes_count} vote
        {spot.votes_count > 1 ? "s" : ""})
      </p>

      <div className="mb-4">
        <p className="mb-2 font-semibold">Votre vote :</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => handleVote(n)}
              disabled={submitting}
              className={`px-3 py-1 rounded ${
                userVote === n ? "bg-green-500 text-white" : "bg-gray-200"
              } hover:bg-green-400`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}