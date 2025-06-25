import { Suspense } from "react";
import SearchResultsPage from "./search-content";

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement des résultats...</div>}>
      <SearchResultsPage />
    </Suspense>
  );
}