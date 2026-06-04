"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BookCard } from "@/components/BookCard";
import { api } from "@/lib/api";
import { Book } from "@/lib/types";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await api.getBooks();
        setBooks(data);
      } catch {
        setBooks([]);
      }
    }

    loadBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-bold text-campus-navy">
            Library Catalog
          </h1>
          <p className="mt-2 text-slate-500">
            Explore books available through the Smart Campus library service.
          </p>
        </div>

        <input
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-campus-gold md:w-80"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">No books found.</p>
        </div>
      )}
    </AppShell>
  );
}