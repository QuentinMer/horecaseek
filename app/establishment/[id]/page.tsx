"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import OpeningHoursDisplay from "@/components/OpeningHoursDisplay";

interface OpeningHours {
  [day: string]: { open: string; close: string } | null;
}

interface Establishment {
  id: string;
  name: string;
  type: string;
  email: string;
  latitude: number;
  longitude: number;
  website: string;
  phone: string;
  opening_hours: OpeningHours;
  price_range: number;
  gallery_urls: string[];
  votes_sum: number;
  votes_count: number;
  description?: string;
}

export default function EstablishmentPage() {
  const params = useParams();
  const establishmentId = params.id;

  const supabase = createClient();

  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!establishmentId) return;

    async function fetchEstablishment() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("establishments")
        .select("*")
        .eq("id", establishmentId)
        .single();

      if (error) {
        setError(error.message);
        setEstablishment(null);
      } else {
        setEstablishment(data);
      }
      setLoading(false);
    }

    fetchEstablishment();
  }, [establishmentId, supabase]);

  if (loading) return <p>Chargement de l&apos;établissement...</p>;
  if (error) return <p className="text-red-600">Erreur : {error}</p>;
  if (!establishment) return <p>Aucun établissement trouvé.</p>;

  const avgVote =
    establishment.votes_count > 0
      ? (establishment.votes_sum / establishment.votes_count).toFixed(1)
      : "N/A";

  return (
    <div className="max-w-4xl mx-2 md:mx-auto p-6 border border-primary rounded-md shadow-md mt-6 md:mt-24">
      <h1 className="text-3xl font-bold mb-4">{establishment.name}</h1>

      {establishment.description && (
        <p className="mb-4 text-gray-700">{establishment.description}</p>
      )}

      <p>Email : {establishment.email}</p>
      <p>Téléphone : {establishment.phone}</p>
      <p>
        Site web :{" "}
        <a
          href={establishment.website}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          {establishment.website}
        </a>
      </p>

      <OpeningHoursDisplay openingHours={establishment.opening_hours ?? {}} />

      <p>Gamme de prix : {establishment.price_range} / 5</p>
      <p>Note moyenne : {avgVote} / 5</p>

      <div className="flex gap-2 overflow-x-auto mt-4">
        {establishment.gallery_urls.map((url, i) => (
          <Image
            key={i}
            src={url}
            alt={`Photo ${i + 1}`}
            width={1000}
            height={1000}
            className="rounded object-cover w-48"
          />
        ))}
      </div>
    </div>
  );
}