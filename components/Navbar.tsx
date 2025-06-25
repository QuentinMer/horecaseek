"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const supabase = createClient();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

useEffect(() => {
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setIsAuthenticated(true);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Erreur chargement profil :", error.message);
        setUserName(user.email ?? null);
        setAvatarUrl(null);
      } else if (profile) {
        setUserName(profile.full_name || user.email);
        setAvatarUrl(profile.avatar_url || null);
      } else {
        setUserName(user.email ?? null);
        setAvatarUrl(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserName(null);
      setAvatarUrl(null);
    }
  };

  checkUser();

  const { data: listener } = supabase.auth.onAuthStateChange(() => {
    checkUser();
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="py-2 font-geist shadow-md z-50 shadow-black/10">
      <div className="flex sm:flex-row flex-col sm:justify-between justify-center items-center mx-[2%] mt-1">
        <Link href={isAuthenticated ? "/protected" : "/"} className="flex items-center">
 <Image
  src="/assets/img/logo/logoHori.svg"
  alt="logo"
  width={150}
  height={150}
  priority
    style={{ width: 150, height: "auto" }}  

/>
</Link>

        <div className="flex sm:flex-row sm:gap-3 md:gap-5 sm:mt-0 gap-2 mt-1 items-center">
          {isAuthenticated ? (
            <>
              {avatarUrl && (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-md border border-primary shadow-md object-cover"
                />
              )}
              <span className="font-medium">{userName}</span>
              <Link href="/auth/compte" className="bg-primary hover:bg-secondary border border-primary text-black font-normal px-4 rounded-md cursor-pointer shadow-md">
                Mon compte
              </Link>
              <button
                onClick={handleLogout}
                className="bg-transparent hover:bg-secondary border border-primary text-black font-normal px-4 rounded-md cursor-pointer shadow-md"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="bg-primary hover:bg-secondary border border-primary text-black font-normal px-4 rounded-md cursor-pointer shadow-md"
              >
                Connexion
              </Link>

              <Link
                href="/auth/sign-up"
                className="bg-transparent hover:bg-secondary border border-primary text-black font-normal px-4 rounded-md cursor-pointer shadow-md"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;