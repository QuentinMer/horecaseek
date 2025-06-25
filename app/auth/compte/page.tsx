"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SpotlightCard from "@/src/blocks/Components/SpotlightCard/SpotlightCard";

interface Profile {
  full_name: string;
  phone: string;
  avatar_url: string;
  type: "client" | "professional";
}

interface Establishment {
  id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  latitude: number;
  longitude: number;
  price_range: number;
  gallery_urls: string[];
}

interface Spot {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  votes_sum: number;
  votes_count: number;
  image_urls?: string[];
}

export default function ProfileCard() {
  const supabase = createClient();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);

  const bgClass = profile && profile.type === "professional" ? "bg-secondary" : "bg-primary";
  const borderClass = profile && profile.type === "professional" ? "border-secondary" : "border-primary";

  useEffect(() => {
    const fetchProfileAndData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, phone, avatar_url, type")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        console.error("Erreur récupération profil :", profileError.message);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      if (profileData.type === "professional") {
        // Récupérer établissements liés à l'utilisateur
        const { data: estData, error: estError } = await supabase
          .from("establishments")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (estError) {
          console.error("Erreur récupération établissements :", estError.message);
        } else {
          setEstablishments(estData || []);
        }
      } else {
        // Récupérer spots liés à l'utilisateur (client)
        const { data: spotsData, error: spotsError } = await supabase
          .from("spots")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (spotsError) {
          console.error("Erreur récupération spots :", spotsError.message);
        } else {
          setSpots(spotsData || []);
        }
      }

      setLoading(false);
    };

    fetchProfileAndData();
  }, [supabase, router]);

  if (loading) return <p>Chargement du profil...</p>;
  if (!profile) return <p>Profil introuvable.</p>;

  return (
    <div className={`flex flex-col md:flex-row px-[5%] min-h-screen min-w-screen ${bgClass}`}>
      <div className="max-w-sm mx-auto font-geist mt-8 p-4 flex flex-col items-center gap-4">
        <SpotlightCard
          className={`custom-spotlight-card border ${borderClass} bg-white shadow-lg p-6`}
          spotlightColor="rgba(12, 193, 138, 0.5)"
        >
          {profile.avatar_url && (
            <Image
              src={profile.avatar_url}
              alt="Avatar"
              width={1000}
              height={1000}
              className="w-full relative h-full rounded-md object-cover"
            />
          )}
          <h2 className="text-xl font-semibold mt-4 text-center">{profile.full_name}</h2>
          <div className="text-center text-gray-600 mt-2">
            <p>Téléphone : {profile.phone || "Non renseigné"}</p>
            <p>Type : {profile.type}</p>
          </div>
        </SpotlightCard>
        <Link
          href="/auth/profile"
          className="bg-white hover:bg-secondary border border-secondary text-black font-normal px-4 py-2 rounded-md cursor-pointer shadow-md"
        >
          Modifier le profil
        </Link>
      </div>

      <div className="flex flex-col justify-start items-center mt-8 pt-8 md:mt-0 md:ml-8 max-w-md w-full">
        {profile.type === "professional" ? (
          <>
            <h3 className="text-lg font-semibold mb-4">Mes établissements</h3>
            <Link href="/protected/establishment/new" className="text-blue-600 hover:underline mb-4">
              Ajouter un établissement
            </Link>

            {establishments.length === 0 ? (
              <p>Aucun établissement ajouté pour le moment.</p>
            ) : (
              <ul className="flex flex-col gap-3 w-full">
                {establishments.map((est) => (
                  <li
                    key={est.id}
                    className="border rounded p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{est.name}</p>
                      <p className="text-sm text-gray-600">{est.type}</p>
                      <p className="text-sm text-gray-600">{est.email}</p>
                    </div>
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => router.push(`/protected/establishment/${est.id}`)}
                    >
                      Modifier
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">Mes spots</h3>
            <Link href="/protected/spot/new" className="text-blue-600 hover:underline mb-4">
              Ajouter un spot
            </Link>

            {spots.length === 0 ? (
              <p>Aucun spot ajouté pour le moment.</p>
            ) : (
              <ul className="flex flex-col gap-3 w-full">
                {spots.map((spot) => {
                  const avgVote = spot.votes_count > 0 ? (spot.votes_sum / spot.votes_count).toFixed(1) : "N/A";
                  return (
                    <li
                      key={spot.id}
                      className="border rounded p-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{spot.description}</p>
                        <p className="text-sm text-gray-600">Note moyenne : {avgVote} / 5</p>
                      </div>
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => router.push(`/protected/spot/${spot.id}`)}
                      >
                        Modifier
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}