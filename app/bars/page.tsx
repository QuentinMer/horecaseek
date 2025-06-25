"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface Establishment {
  id: string;
  name: string;
  type: string;
  email: string;
  latitude: number;
  longitude: number;
  website: string;
  phone: string;
  opening_hours: Record<string, { open: string; close: string } | null> | string;
  price_range: number;
  gallery_urls?: string[];
}

export default function BarPage() {
  const supabase = createClient();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEstablishments() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("establishments")
        .select("*")
        .eq("type", "bar");

      if (error) {
        setError(error.message);
        setEstablishments([]);
      } else if (data) {
        setEstablishments(data);
      }
      setLoading(false);
    }
    fetchEstablishments();
  }, [supabase]);

  if (loading) return <p>Chargement des bars...</p>;
  if (error) return <p className="text-red-600">Erreur : {error}</p>;
  if (establishments.length === 0) return <p>Aucun bar trouvé.</p>;

  // Fonction pour afficher lisiblement les horaires
  function renderOpeningHours(opening_hours: Establishment["opening_hours"]) {
    if (!opening_hours) return "Non renseigné";

    // Si c'est une string (ex: JSON brut), tenter de parser
    let hoursObj: Record<string, { open: string; close: string } | null>;
    if (typeof opening_hours === "string") {
      try {
        hoursObj = JSON.parse(opening_hours);
      } catch {
        return opening_hours; // Affiche la string brute si parsing échoue
      }
    } else {
      hoursObj = opening_hours;
    }

    return Object.entries(hoursObj)
      .map(([day, times]) => {
        if (!times) return `${day}: fermé`;
        return `${day}: ${times.open} - ${times.close}`;
      })
      .join(", ");
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Bars</h1>
      <ul className="flex flex-col gap-6">
        {establishments.map((est) => (
          <li key={est.id} className="border rounded p-4 shadow-md flex flex-col gap-3">
            <h2 className="font-semibold">{est.name}</h2>
            <p>Email : {est.email}</p>
            <p>Téléphone : {est.phone}</p>
            <p>
              Adresse web :{" "}
              <a href={est.website} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                {est.website}
              </a>
            </p>
            <p>Horaires : {renderOpeningHours(est.opening_hours)}</p>
            <p>Gamme de prix : {est.price_range} / 5</p>
            <div className="flex gap-2 overflow-x-auto">
              {(est.gallery_urls || []).map((url, i) => (
                <Image
                  key={i}
                  src={url}
                  alt={`Photo ${i + 1}`}
                  width={320}
                  height={240}
                  className="rounded object-cover"
                  unoptimized
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}