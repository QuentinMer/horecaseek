"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login"); // Redirection si pas connecté
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    });
  }, [router, supabase]);

  if (loading) {
    return <p className="text-center mt-10">Chargement...</p>;
  }

  if (!authenticated) {
    // On peut aussi afficher rien ou un message d’accès refusé
    return null;
  }

  return (
    <main className="antialiased min-h-screen flex flex-col font-manrope">
      <div className="flex-grow">{children}</div>

      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
        <ThemeSwitcher />
      </footer>
    </main>
  );
}