"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface OpeningHours {
  [day: string]: { open: string; close: string } | null;
}

interface Establishment {
  id: string;
  name: string;
  type: "restaurant" | "bar" | "traiteur" | "hotel";
  email: string;
  website: string;
  phone: string;
  price_range: number;
  latitude: number;
  longitude: number;
  opening_hours: OpeningHours;
  gallery_urls: string[];
  user_id: string;
}

const daysOfWeek = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];

export default function EditEstablishmentPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const establishmentId = params.id;

  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState<Establishment["type"]>("restaurant");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [priceRange, setPriceRange] = useState(3);
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [openingHours, setOpeningHours] = useState<OpeningHours>(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = null;
      return acc;
    }, {} as OpeningHours)
  );
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!establishmentId) return;

    async function fetchEstablishment() {
      setLoading(true);
      const { data, error } = await supabase
        .from("establishments")
        .select("*")
        .eq("id", establishmentId)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setEstablishment(data);
        setName(data.name);
        setType(data.type);
        setEmail(data.email);
        setWebsite(data.website);
        setPhone(data.phone);
        setPriceRange(data.price_range);
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        setOpeningHours(data.opening_hours || openingHours);
        setGalleryUrls(data.gallery_urls || []);
      }
      setLoading(false);
    }

    fetchEstablishment();
  }, [establishmentId, supabase]);

  const uploadGalleryImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("establishments")
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("establishments")
        .getPublicUrl(data.path);

      urls.push(publicUrlData.publicUrl);
    }
    return urls;
  };

  const handleOpeningHoursChange = (
    day: string,
    field: "open" | "close",
    value: string
  ) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] ?? { open: "", close: "" }),
        [field]: value,
      },
    }));
  };

  const toggleDayClosed = (day: string) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: prev[day] ? null : { open: "09:00", close: "17:00" },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let updatedGalleryUrls = galleryUrls;
      if (galleryFiles.length > 0) {
        const uploadedUrls = await uploadGalleryImages(galleryFiles);
        updatedGalleryUrls = [...galleryUrls, ...uploadedUrls];
      }

      if (!name) throw new Error("Le nom est requis");
      if (!email) throw new Error("L&apos;email est requis");
      if (latitude === "" || longitude === "") throw new Error("Latitude et longitude requises");

      const updateData = {
        name,
        type,
        email,
        website,
        phone,
        price_range: priceRange,
        latitude,
        longitude,
        opening_hours: openingHours,
        gallery_urls: updatedGalleryUrls,
      };

      const { error: updateError } = await supabase
        .from("establishments")
        .update(updateData)
        .eq("id", establishmentId);

      if (updateError) throw updateError;

      alert("Établissement mis à jour avec succès !");
      router.back();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur inconnue");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!establishment) return <p>Établissement introuvable.</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4">Modifier l&apos;établissement</h2>

      <label>
        Nom
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2"
        />
      </label>

      <label>
        Type
        <select
          value={type}
          onChange={(e) => setType(e.target.value as Establishment["type"])}
          className="w-full border rounded p-2"
        >
          <option value="restaurant">Restaurant</option>
          <option value="bar">Bar</option>
          <option value="traiteur">Traiteur</option>
          <option value="hotel">Hôtel</option>
        </select>
      </label>

      <label>
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2"
        />
      </label>

      <label>
        Site web
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full border rounded p-2"
        />
      </label>

      <label>
        Téléphone
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded p-2"
        />
      </label>

      <label>
        Gamme de prix
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(parseInt(e.target.value))}
          className="w-full border rounded p-2"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
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

      <fieldset className="border p-4 rounded">
        <legend className="font-semibold mb-2">Horaires d&apos;ouverture</legend>
        {daysOfWeek.map((day) => (
          <div key={day} className="flex items-center gap-2 mb-2">
            <label className="capitalize w-20">{day}</label>

            <input
              type="time"
              disabled={!openingHours[day]}
              value={openingHours[day]?.open || ""}
              onChange={(e) => handleOpeningHoursChange(day, "open", e.target.value)}
              className="border rounded p-1"
            />

            <span>à</span>

            <input
              type="time"
              disabled={!openingHours[day]}
              value={openingHours[day]?.close || ""}
              onChange={(e) => handleOpeningHoursChange(day, "close", e.target.value)}
              className="border rounded p-1"
            />

            <label className="ml-4 flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!openingHours[day]}
                onChange={() => toggleDayClosed(day)}
              />
              Ouvert
            </label>
          </div>
        ))}
      </fieldset>

      <label>
        Galerie photos
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) setGalleryFiles(Array.from(e.target.files));
          }}
          className="w-full"
        />
      </label>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white p-2 rounded hover:bg-primary-dark disabled:opacity-50"
      >
        {loading ? "Enregistrement..." : "Mettre à jour l&apos;établissement"}
      </button>
    </form>
  );
}