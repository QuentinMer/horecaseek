"use client";

import { useEffect, useState } from "react";
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
}

export default function RestaurantPage() {
  const supabase = createClient();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("");

  useEffect(() => {
    async function fetchEstablishments() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("establishments")
        .select("*")
        .eq("type", "restaurant");

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

  const sortedEstablishments = [...establishments].sort((a, b) => {
    switch (sortOption) {
      case "price":
        return a.price_range - b.price_range;
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        const avgA = a.votes_count > 0 ? a.votes_sum / a.votes_count : 0;
        const avgB = b.votes_count > 0 ? b.votes_sum / b.votes_count : 0;
        return avgB - avgA;
      default:
        return 0;
    }
  });

  if (loading) return <p>Chargement des restaurants...</p>;
  if (error) return <p className="text-red-600">Erreur : {error}</p>;
  if (establishments.length === 0) return <p>Aucun restaurant trouvé.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Restaurants</h1>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Trier par</option>
          <option value="price">Prix (croissant)</option>
          <option value="name">Ordre alphabétique</option>
          <option value="rating">Note moyenne</option>
        </select>
      </div>

      <ul className="flex flex-col gap-6">
        {sortedEstablishments.map((est) => {
          const avgVote =
            est.votes_count > 0 ? (est.votes_sum / est.votes_count).toFixed(1) : "N/A";

          return (
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
              <OpeningHoursDisplay openingHours={est.opening_hours ?? {}} />
              <p>Gamme de prix : {est.price_range} / 5</p>
              <p>Note moyenne : {avgVote} / 5</p>
              <div className="flex gap-2 overflow-x-auto">
                {est.gallery_urls.map((url, i) => (
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}