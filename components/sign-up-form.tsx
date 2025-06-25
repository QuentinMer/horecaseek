"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SimpleSignUpForm() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(false);

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("Utilisateur non créé");

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        user_id: data.user.id,
        full_name: "",      
        phone: "",
        avatar_url: "",
        type: "client",     
      });

    if (profileError) throw profileError;

    setSuccess(true);
    router.push("/auth/profile");  
  } catch (error: unknown) {
    setError(error instanceof Error ? error.message : "Erreur inconnue lors de la création du compte.");
  }
};

  return (
    <div className="flex flex-col w-full items-center justify-center p-6 md:p-10">
    <form onSubmit={handleSignUp} className="flex flex-col font-geist gap-4 max-w-sm mx-auto border border-primary p-12 rounded-md shadow-md">
      <h2 className="text-xl font-semibold">Inscription</h2>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
      </div>

      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && (
        <p className="text-green-600 text-sm">
          Inscription réussie ! Tu vas être redirigé vers la création de ton profil.
        </p>
      )}

      <Button className="hover:bg-secondary" type="submit">Créer compte</Button>
    </form>
    <div className="text-center mt-4 bg-primary text-black font-geist p-4 rounded">
<p>
  Après l&apos;insertion de votre email et mot de passe<br />
  vous serez redirigé·e pour finaliser la création de votre compte
</p>    </div>
      </div>
  );
}