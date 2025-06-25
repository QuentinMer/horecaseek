"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AddSpotPage() {
  const supabase = createClient();

  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [images, setImages] = useState<File[]>([]);
  const [vote, setVote] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Upload images dans Storage et récupérer les URLs publiques
  const uploadImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      // Upload dans le bucket "spots"
      const { data, error } = await supabase.storage
        .from("spots")
        .upload(fileName, file);

      if (error) throw error;

      // Récupération de l'URL publique dans le même bucket "spots"
      const { data: publicUrlData } = supabase.storage
        .from("spots")
        .getPublicUrl(data.path);

      urls.push(publicUrlData.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (latitude === "" || longitude === "") {
        setError("Veuillez entrer une latitude et une longitude valides.");
        setLoading(false);
        return;
      }

      // Upload des images et récupération des URLs publiques
      const imageUrls = await uploadImages(images);

      // Récupérer l'user id connecté
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Utilisateur non connecté");

      // Insert dans la table spots
      const { error: insertError } = await supabase
        .from("spots")
        .insert({
          user_id: user.id,
          description,
          latitude,
          longitude,
          image_urls: imageUrls,
          votes_sum: vote,
          votes_count: 1,
        });

      if (insertError) throw insertError;

      alert("Spot ajouté avec succès !");
      // Réinitialiser le formulaire
      setDescription("");
      setLatitude("");
      setLongitude("");
      setImages([]);
      setVote(3);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ajouter un Spot</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </label>

        <label>
          Latitude
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}
            required
            className="w-full border rounded p-2"
          />
        </label>

        <label>
          Longitude
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value))}
            required
            className="w-full border rounded p-2"
          />
        </label>

        <label>
          Images (tu peux en sélectionner plusieurs)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setImages(Array.from(e.target.files));
              }
            }}
            className="w-full"
          />
        </label>

        <label>
          Note initiale
          <select
            value={vote}
            onChange={(e) => setVote(parseInt(e.target.value))}
            className="w-full border rounded p-2"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white rounded py-2 hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? "Ajout en cours..." : "Ajouter le spot"}
        </button>
      </form>
    </div>
  );
}