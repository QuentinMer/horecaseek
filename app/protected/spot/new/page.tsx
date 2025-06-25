"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function NewSpotPage() {
  const supabase = createClient();

  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [images, setImages] = useState<File[]>([]);
  const [vote, setVote] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImages = async (files: File[]) => {
    const urls: string[] = [];
    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("spots")
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("spots")
        .getPublicUrl(data.path);

      urls.push(publicUrlData.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (latitude === "" || longitude === "") {
      setError("Latitude et longitude sont obligatoires");
      setLoading(false);
      return;
    }

    try {
      const imageUrls = await uploadImages(images);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Utilisateur non connecté");

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
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded p-2"
          />
        </label>

        <label>
          Latitude
          <input
            type="number"
            step="any"
            required
            value={latitude}
            onChange={e => setLatitude(parseFloat(e.target.value))}
            className="w-full border rounded p-2"
          />
        </label>

        <label>
          Longitude
          <input
            type="number"
            step="any"
            required
            value={longitude}
            onChange={e => setLongitude(parseFloat(e.target.value))}
            className="w-full border rounded p-2"
          />
        </label>

        <label>
          Images (plusieurs)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={e => setImages(e.target.files ? Array.from(e.target.files) : [])}
            className="w-full"
          />
        </label>

        <label>
          Note initiale
          <select
            value={vote}
            onChange={e => setVote(parseInt(e.target.value))}
            className="w-full border rounded p-2"
          >
            {[1,2,3,4,5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        {error && <p className="text-red-500">{error}</p>}

        <button
          disabled={loading}
          type="submit"
          className="bg-primary text-white py-2 rounded hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? "Ajout en cours..." : "Ajouter le spot"}
        </button>
      </form>
    
      <Link href="/auth/compte" className="text-blue-600 ">
        Retour à mon compte
      </Link>
    </div>
  );
}