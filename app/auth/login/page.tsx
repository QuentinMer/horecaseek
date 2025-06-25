"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LoginForm } from "@/components/login-form";

export default function Page() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

useEffect(() => {
  const code = searchParams.get("code");
  const email = searchParams.get("email"); 

  if (code && email) {
    supabase.auth.verifyOtp({
      type: "signup",
      token: code,
      email: email,
    }).then(({ error }) => {
      if (error) {
        console.error("Error verifying OTP:", error.message);
      } else {
        router.push("/create-profile");
      }
    });
  }
}, [supabase, router, searchParams]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}