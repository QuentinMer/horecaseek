import { Suspense } from "react";
import { LoginPage } from "./login-content";

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <LoginPage />
    </Suspense>
  );
}