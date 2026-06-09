"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { Book } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { isStudent } from "@/lib/roles";

export default function LibraryPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  async function loadBooks() {
    const data = await api.getBooks();
    setBooks(data);
  }

  useEffect(() => {
    loadBooks().catch(() => setBooks([]));
  }, []);

  async function requestLoan(bookId: string) {
    if (!user?.email) return;

    try {
      await api.createLoan({
        userEmail: user.email,
        bookId,
      });

      setMessage("Loan requested successfully.");
      await loadBooks();
    } catch {
      setMessage("Could not request loan. Please try again.");
    }
  }

  const filteredBooks = books.filter((book) =>
    book.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-bold text-[#002b5c]">
            Library Catalog
          </h1>
          <p className="mt-2 text-slate-500">
            Explore books available through the Smart Campus library service.
          </p>
        </div>

        <input
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430] md:w-80"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {message && (
        <div className="mt-6 rounded-xl bg-[#f4c430]/20 p-4 font-bold text-[#002b5c]">
          {message}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredBooks.map((book) => {
          const availableCopies = book.availableCopies ?? 0;

          return (
            <div
              key={book.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#002b5c] text-xl font-bold text-[#f4c430]">
                {book.title?.charAt(0) || "B"}
              </div>

              <h3 className="text-xl font-bold text-[#002b5c]">
                {book.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {book.author?.name || "Unknown author"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {book.category?.name || "General category"}
              </p>

              <div className="mt-4 rounded-full bg-green-100 px-3 py-2 text-center text-sm font-bold text-green-700">
                {availableCopies > 0
                  ? `${availableCopies} copies available`
                  : "No copies available"}
              </div>

              {isStudent(user) && (
                <button
                  onClick={() => requestLoan(book.id)}
                  disabled={availableCopies <= 0}
                  className="mt-4 w-full rounded-xl bg-[#002b5c] px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Request Loan
                </button>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}