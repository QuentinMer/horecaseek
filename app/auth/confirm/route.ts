import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    const next = searchParams.get("next") ?? "/";

    if (!token_hash || !type) {
      redirect(`/auth/error?error=Missing token_hash or type`);
      return;
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
      return;
    }

    redirect(next);
  } catch (err: unknown) {
    if (err instanceof Error) {
      redirect(`/auth/error?error=${encodeURIComponent(err.message)}`);
    } else {
      redirect(`/auth/error?error=Unknown error`);
    }
  }
}