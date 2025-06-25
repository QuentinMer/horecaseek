"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfileForm() {
  const supabase = createClient();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState<"client" | "professional">("client");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/auth/login");
        return;
      }
      setUserId(data.user.id);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, phone, avatar_url, type")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Erreur récupération profil :", profileError);
        return;
      }

      if (profileData) {
        setFullName(profileData.full_name || "");
        setPhone(profileData.phone || "");
        setExistingAvatarUrl(profileData.avatar_url || null);
        setUserType(profileData.type || "client");
      }
    };

    fetchProfile();
  }, [supabase, router]);

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setAvatarPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setAvatarPreview(null);
  }, [avatarFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let avatarUrl = existingAvatarUrl;

      if (avatarFile && userId) {
        const fileExt = avatarFile.name.split(".").pop();

        if (!fileExt) throw new Error("Impossible de déterminer l'extension du fichier.");

        const fileName = `${userId}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) throw new Error(uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(uploadData.path);

        avatarUrl = publicUrlData?.publicUrl || null;
      }

      const { error: upsertError } = await supabase.from("profiles").upsert({
        user_id: userId,
        full_name: fullName,
        phone,
        avatar_url: avatarUrl,
        type: userType,
      });

      if (upsertError) throw new Error(upsertError.message);

      router.push("/auth/compte"); // Redirection après succès
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) return <p>Chargement...</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-8">
      <h2 className="text-xl font-semibold">Mon profil</h2>

      <div>
        <Label htmlFor="fullName">Nom complet</Label>
        <Input
          id="fullName"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="userType">Type</Label>
        <select
          id="userType"
          className="border rounded p-2 w-full"
          value={userType}
          onChange={(e) => setUserType(e.target.value as "client" | "professional")}
        >
          <option value="client">Client</option>
          <option value="professional">Professionnel</option>
        </select>
      </div>

      <div>
        <Label htmlFor="avatar">Avatar</Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) setAvatarFile(e.target.files[0]);
          }}
        />
        {avatarPreview ? (
          <Image
            src={avatarPreview}
            alt="Preview"
            width={96}
            height={96}
            className="rounded-full object-cover mt-2"
          />
        ) : existingAvatarUrl ? (
          <Image
            src={existingAvatarUrl}
            alt="Avatar"
            width={96}
            height={96}
            className="rounded-full object-cover mt-2"
          />
        ) : null}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Enregistrement..." : "Sauvegarder"}
      </Button>
    </form>
  );
}