"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function CreateProfileForm() {
  const supabase = createClient();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/auth/login");
      } else {
        setUserId(data.user.id);
      }
    };
    fetchUser();
  }, [supabase, router]);

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setAvatarPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAvatarPreview(null);
    }
  }, [avatarFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let avatarUrl: string | null = null;

      if (avatarFile && userId) {
        const fileExt = avatarFile.name.split(".").pop();
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

      const { error: insertError } = await supabase.from("profiles").insert({
        user_id: userId,
        full_name: fullName,
        phone,
        avatar_url: avatarUrl,
      });

      if (insertError) throw new Error(insertError.message);

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-8">
      <h2 className="text-xl font-semibold">Complete your profile</h2>

      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="avatar">Avatar</Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setAvatarFile(e.target.files[0]);
            }
          }}
        />
        {avatarPreview && (
          <Image
            src={avatarPreview}
            alt="Preview"
            width={96}
            height={96}
            className="rounded-full object-cover mt-2"
          />
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating profile..." : "Save profile"}
      </Button>
    </form>
  );
}