"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Result {
  id: string;
  type: "establishment" | "spot";
  name?: string;
  description?: string;
  spotType?: string;
}

const RESULTS_PER_PAGE = 10;

const SearchResultsPage = () => {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const safeQuery = query.replace(/'/g, "''");

        const { data: estData, error: estError } = await supabase
          .from("establishments")
          .select("id, name, type")
          .or(`name.ilike.%${safeQuery}%,type.ilike.%${safeQuery}%`);

        if (estError) throw estError;

        const { data: spotData, error: spotError } = await supabase
          .from("spots")
          .select("id, description")
          .ilike("description", `%${safeQuery}%`);

        if (spotError) throw spotError;

        const formattedEstablishments = (estData || []).map((e) => ({
          id: e.id,
          type: "establishment" as const,
          name: e.name,
          spotType: e.type,
        }));

        const formattedSpots = (spotData || []).map((s) => ({
          id: s.id,
          type: "spot" as const,
          description: s.description,
        }));

        const allResults = [...formattedEstablishments, ...formattedSpots];
        setTotalResults(allResults.length);

        const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
        const paginatedResults = allResults.slice(startIndex, startIndex + RESULTS_PER_PAGE);

        setResults(paginatedResults);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Erreur Supabase :", err.message);
        } else {
          console.error("Erreur inconnue :", err);
        }
        setResults([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage, supabase]);

  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  return (
    <div className="max-w-4xl mx-auto p-6 font-geist">
      <h1 className="text-2xl font-bold mb-4">Résultats pour &quot;{query}&quot;</h1>

      {loading && (
        <div className="flex justify-center my-6">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
          <style>{`
            .loader {
              border-top-color: #3498db;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {!loading && results.length === 0 && <p>Aucun résultat trouvé.</p>}

      <ul className="flex flex-col gap-3">
        {results.map((item) => (
          <li key={item.id} className="border border-primary p-3 rounded hover:bg-primary cursor-pointer">
            {item.type === "establishment" ? (
              <Link href={`/establishment/${item.id}`}>
  <span className="text-black font-semibold cursor-pointer">{item.name}</span>
</Link>
            ) : (
            <Link href={`/spots/${item.id}`}>
  <span className="text-black cursor-pointer">{item.description}</span>
</Link>
            )}
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <Link
                key={pageNum}
                href={`/search?query=${encodeURIComponent(query)}&page=${pageNum}`}
                className={`px-3 py-1 rounded cursor-pointer border ${
                  pageNum === currentPage
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-black border-gray-300 hover:bg-gray-200"
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;