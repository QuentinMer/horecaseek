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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      setSuccess(true);
      router.push("/auth/compte");  // redirection vers la page profil
    } else {
      setError("Erreur inconnue lors de la création du compte.");
    }
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold">Sign up</h2>

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
        <Label htmlFor="password">Password</Label>
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

      <Button type="submit">Sign up</Button>
    </form>
  );
}