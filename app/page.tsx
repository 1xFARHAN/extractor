"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination";
import { RequestModal } from "@/components/RequestModal";
import { ResultsTable, type GermplasmEntry } from "@/components/ResultsTable";
import { SearchBar } from "@/components/SearchBar";
import { Toast } from "@/components/Toast";

type EntriesResponse = {
  data: GermplasmEntry[];
  total: number;
  page: number;
  totalPages: number;
};

const PAGE_SIZE = 20;

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState<"name" | "descriptor">("descriptor");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [entries, setEntries] = useState<GermplasmEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<GermplasmEntry | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    async function loadEntries() {
      if (!debouncedSearch) {
        setEntries([]);
        setTotal(0);
        setTotalPages(1);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          search: debouncedSearch,
          mode: searchMode,
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        const response = await fetch(`/api/entries?${params.toString()}`, {
          cache: "no-store",
        });
        const result = (await response.json()) as EntriesResponse;
        setEntries(result.data);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      } catch {
        setEntries([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    }

    loadEntries();
  }, [debouncedSearch, page, searchMode]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dcfce7_0%,transparent_26%),linear-gradient(180deg,#f5fff8_0%,#ecfdf3_40%,#ffffff_100%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-emerald-200/80 bg-white/95 p-3 shadow-[0_24px_80px_-32px_rgba(22,101,52,0.22)] sm:p-4">
          <div className="relative aspect-[16/6] overflow-hidden rounded-[1.5rem]">
            <Image
              src="/genom-data-building.jpeg"
              alt="Genom Data building"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/25 via-transparent to-white/10" />
            <div className="absolute inset-x-3 top-0 z-10 rounded-2xl bg-white/88 px-4 py-3 text-center text-base font-bold uppercase tracking-[0.14em] text-emerald-950 backdrop-blur sm:inset-x-6 sm:top-1 sm:px-6 sm:py-4 sm:text-xl lg:inset-x-8 lg:top-2 lg:px-8 lg:py-5 lg:text-2xl">
              National Crop Genomics and Speed Breeding Centre for Agriculture Sustainability
              (NCG&amp;SBCAS)
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-emerald-200/80 bg-white/95 p-4 shadow-[0_20px_60px_-36px_rgba(22,101,52,0.2)] sm:p-6">
          <SearchBar
            value={search}
            mode={searchMode}
            onChange={setSearch}
            onModeChange={setSearchMode}
          />
        </section>

        {debouncedSearch ? (
          <section className="rounded-[2rem] border border-emerald-200/80 bg-white/95 shadow-[0_20px_60px_-36px_rgba(22,101,52,0.2)]">
            <div className="border-b border-emerald-100 px-4 py-4 sm:px-6">
              <p className="text-base font-semibold text-emerald-950">
                Showing {entries.length} of {total} records for {searchMode}: {debouncedSearch}
              </p>
            </div>
            <ResultsTable entries={entries} isLoading={isLoading} onRequest={setSelectedEntry} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </section>
        ) : null}
      </div>

      <RequestModal
        entry={selectedEntry}
        isOpen={Boolean(selectedEntry)}
        onClose={() => setSelectedEntry(null)}
        onSuccess={() => setToastMessage("Your request has been submitted successfully!")}
      />

      {toastMessage ? <Toast message={toastMessage} onClose={() => setToastMessage("")} /> : null}
    </main>
  );
}
