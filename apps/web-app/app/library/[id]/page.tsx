"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { Book } from "@/lib/types";

export default function BookDetailPage() {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    async function loadBook() {
      try {
        const data = await api.getBookById(String(params.id));
        setBook(data || null);
      } catch {
        setBook(null);
      }
    }

    loadBook();
  }, [params.id]);

  return (
    <AppShell>
      <Link href="/library" className="font-semibold text-campus-navy">
        ← Back to Library
      </Link>

      {!book ? (
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-slate-500">Book not found.</p>
        </div>
      ) : (
        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-campus-navy text-4xl font-bold text-campus-gold">
            {book.title?.charAt(0) || "B"}
          </div>

          <h1 className="text-4xl font-bold text-campus-navy">
            {book.title}
          </h1>

          <p className="mt-4 text-slate-500">
            {book.description || "No description available."}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Author</p>
              <p className="font-bold text-campus-navy">
                {book.author?.name || "Unknown"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Category</p>
              <p className="font-bold text-campus-navy">
                {book.category?.name || "General"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">ISBN</p>
              <p className="font-bold text-campus-navy">
                {book.isbn || "Not registered"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Availability</p>
              <p className="font-bold text-campus-navy">
                {book.availableCopies ?? 0} / {book.totalCopies ?? 0} copies
              </p>
            </div>
          </div>
        </section>
      )}
    </AppShell>
  );
}