"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface Spot {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  image_urls: string[];
  votes_sum: number;
  votes_count: number;
}

export default function SpotDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [spot, setSpot] = useState<Spot | null>(null);
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchSpot = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("spots")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setSpot(data);
        setDescription(data.description);
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        setExistingImages(data.image_urls || []);
      }
      setLoading(false);
    };

    fetchSpot();
  }, [id, supabase]);

  const uploadImages = async (files: File[]) => {
    const urls: string[] = [];
    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("spots")
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("spots")
        .getPublicUrl(data.path);

      urls.push(publicUrlData.publicUrl);
    }
    return urls;
  };

  const handleSave = async () => {
  setSaving(true);
  setError(null);

  try {
    if (latitude === "" || longitude === "") {
      throw new Error("Latitude et longitude sont obligatoires");
    }

    let updatedImageUrls = existingImages;
    if (images.length > 0) {
      const uploadedUrls = await uploadImages(images);
      updatedImageUrls = [...existingImages, ...uploadedUrls];
    }

    const { error: updateError } = await supabase
      .from("spots")
      .update({
        description,
        latitude,
        longitude,
        image_urls: updatedImageUrls,
      })
      .eq("id", id);

    if (updateError) throw updateError;

    alert("Spot mis à jour avec succès !");
    router.back();  
  } catch (err: any) {
    setError(err.message || "Une erreur est survenue");
  } finally {
    setSaving(false);
  }
};

  if (loading) return <p>Chargement du spot...</p>;
  if (error) return <p className="text-red-600">Erreur : {error}</p>;
  if (!spot) return <p>Spot non trouvé.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier le spot</h1>

      <label className="block mb-2">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2"
          rows={4}
        />
      </label>

      <label className="block mb-2">
        Latitude
        <input
          type="number"
          step="any"
          value={latitude}
          onChange={(e) => setLatitude(parseFloat(e.target.value))}
          className="w-full border rounded p-2"
        />
      </label>

      <label className="block mb-2">
        Longitude
        <input
          type="number"
          step="any"
          value={longitude}
          onChange={(e) => setLongitude(parseFloat(e.target.value))}
          className="w-full border rounded p-2"
        />
      </label>

      <div className="mb-4">
        <p>Images existantes :</p>
        <div className="flex gap-2 overflow-x-auto">
          {existingImages.map((url, i) => (
            <Image
              key={i}
              src={url}
              alt={`Image spot ${i + 1}`}
              width={150}
              height={100}
              className="rounded object-cover"
              unoptimized
            />
          ))}
        </div>
      </div>

      <label className="block mb-4">
        Ajouter des images
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(e.target.files ? Array.from(e.target.files) : [])}
          className="w-full"
        />
      </label>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark disabled:opacity-50"
      >
        {saving ? "Sauvegarde en cours..." : "Sauvegarder les modifications"}
      </button>
    </div>
  );
}