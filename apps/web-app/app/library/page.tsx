"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  LibraryBig,
  Search,
  Tags,
  UserRound,
  WalletCards,
} from "lucide-react";
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
  const [messageType, setMessageType] = useState<"success" | "error">("success");

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

      setMessageType("success");
      setMessage("Loan requested successfully.");
      await loadBooks();
    } catch {
      setMessageType("error");
      setMessage("The loan request could not be completed. Please try again.");
    }
  }

  const filteredBooks = books.filter((book) =>
    book.title?.toLowerCase().includes(search.toLowerCase())
  );

  const availableBooks = books.filter((book) => (book.availableCopies ?? 0) > 0);

  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Library Service
        </p>

        <h1 className="mt-4 text-5xl font-extrabold">Library Catalog</h1>

        <p className="mt-4 max-w-3xl text-lg text-white/80">
          Explore the academic book catalog, review availability and request
          loans using the Smart Campus library service.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Badge text="Books" />
          <Badge text="Authors" />
          <Badge text="Categories" />
          <Badge text="Loans" />
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <InfoCard
          icon={<BookOpen />}
          title="Total Books"
          value={books.length}
          text="Books registered in the catalog."
        />

        <InfoCard
          icon={<CheckCircle2 />}
          title="Available Books"
          value={availableBooks.length}
          text="Books with at least one available copy."
        />

        <InfoCard
          icon={<WalletCards />}
          title="Loan Requests"
          value="Enabled"
          text="Students can request available books."
        />
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-[#002b5c]">
              Book Catalog
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Search by title and check whether a book is available before
              requesting a loan.
            </p>
          </div>

          <div className="flex w-full items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 focus-within:border-[#f4c430] md:w-96">
            <Search size={20} className="text-slate-400" />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Search books by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {message && (
          <AlertMessage type={messageType} message={message} />
        )}

        {filteredBooks.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-10 text-center ring-1 ring-slate-200">
            <LibraryBig className="mx-auto text-slate-400" size={42} />
            <h3 className="mt-4 text-xl font-extrabold text-[#002b5c]">
              No books found
            </h3>
            <p className="mt-2 text-slate-500">
              Try another search term or verify that books have been registered.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBooks.map((book) => {
              const availableCopies = book.availableCopies ?? 0;
              const isAvailable = availableCopies > 0;

              return (
                <div
                  key={book.id}
                  className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200 transition hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#002b5c] text-xl font-extrabold text-[#f4c430]">
                      {book.title?.charAt(0) || "B"}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                        isAvailable
                          ? "bg-green-50 text-green-700 ring-green-200"
                          : "bg-red-50 text-red-700 ring-red-200"
                      }`}
                    >
                      {isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-extrabold text-[#002b5c]">
                    {book.title}
                  </h3>

                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <BookDetail
                      icon={<UserRound size={17} />}
                      text={book.author?.name || "Unknown author"}
                    />
                    <BookDetail
                      icon={<Tags size={17} />}
                      text={book.category?.name || "General category"}
                    />
                    <BookDetail
                      icon={<BookOpen size={17} />}
                      text={`${availableCopies} copies available`}
                    />
                  </div>

                  {isStudent(user) && (
                    <button
                      onClick={() => requestLoan(book.id)}
                      disabled={!isAvailable}
                      className="mt-6 w-full rounded-xl bg-[#002b5c] px-4 py-3 font-bold text-white shadow-sm transition hover:bg-[#003b7a] disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {isAvailable ? "Request Loan" : "No Copies Available"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur">
      {text}
    </span>
  );
}

function InfoCard({
  icon,
  title,
  value,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  text: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 inline-flex rounded-2xl bg-[#f4c430]/20 p-4 text-[#002b5c]">
        {icon}
      </div>

      <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-extrabold text-[#002b5c]">{value}</h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function BookDetail({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#002b5c]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function AlertMessage({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  const success = type === "success";

  return (
    <div
      className={`mb-6 flex items-start gap-3 rounded-xl p-4 text-sm font-medium ring-1 ${
        success
          ? "bg-green-50 text-green-700 ring-green-200"
          : "bg-red-50 text-red-700 ring-red-200"
      }`}
    >
      {success ? (
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
      ) : (
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}