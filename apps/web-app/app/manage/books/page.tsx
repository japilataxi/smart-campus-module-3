"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, LibraryBig, Tags, UserRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";

export default function ManageBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [form, setForm] = useState({
    title: "",
    isbn: "",
    totalCopies: 1,
    authorId: "",
    categoryId: "",
  });

  function updateField(field: string, value: string | number) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function loadData() {
    const [booksData, authorsData, categoriesData] = await Promise.all([
      api.getBooks(),
      api.getAuthors(),
      api.getCategories(),
    ]);

    setBooks(booksData);
    setAuthors(authorsData);
    setCategories(categoriesData);
  }

  async function createBook(event: React.FormEvent) {
    event.preventDefault();

    await api.createBook({
      title: form.title,
      isbn: form.isbn,
      totalCopies: Number(form.totalCopies),
      authorId: form.authorId,
      categoryId: form.categoryId,
    });

    setForm({
      title: "",
      isbn: "",
      totalCopies: 1,
      authorId: "",
      categoryId: "",
    });

    await loadData();
  }

  useEffect(() => {
    loadData().catch(() => {
      setBooks([]);
      setAuthors([]);
      setCategories([]);
    });
  }, []);

  const availableBooks = books.filter((book) => (book.availableCopies ?? 0) > 0);

  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Library Management
        </p>

        <h1 className="mt-4 text-5xl font-extrabold">Manage Books</h1>

        <p className="mt-4 max-w-3xl text-lg text-white/80">
          Register academic books, connect them with authors and categories, and
          control the number of available copies.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <InfoCard icon={<LibraryBig />} title="Total Books" value={books.length} text="Books registered in the library catalog." />
        <InfoCard icon={<CheckCircle2 />} title="Available Books" value={availableBooks.length} text="Books with at least one available copy." />
        <InfoCard icon={<UserRound />} title="Authors" value={authors.length} text="Authors available for book registration." />
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-[#002b5c]">
            Create Book
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Complete the form to add a new book to the Library Service catalog.
          </p>
        </div>

        <form onSubmit={createBook} className="grid gap-4 md:grid-cols-2">
          <input className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]" placeholder="Book title" value={form.title} onChange={(e) => updateField("title", e.target.value)} required />

          <input className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]" placeholder="ISBN" value={form.isbn} onChange={(e) => updateField("isbn", e.target.value)} />

          <select className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]" value={form.authorId} onChange={(e) => updateField("authorId", e.target.value)}>
            <option value="">Select author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>

          <select className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]" value={form.categoryId} onChange={(e) => updateField("categoryId", e.target.value)}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]" type="number" min={1} placeholder="Total copies" value={form.totalCopies} onChange={(e) => updateField("totalCopies", Number(e.target.value))} />

          <button className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white transition hover:bg-[#003b7a] md:col-span-2">
            Create Book
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-[#002b5c]">
              Book Records
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review registered books, authors, categories and available copies.
            </p>
          </div>

          <span className="rounded-full bg-[#002b5c]/10 px-4 py-2 text-sm font-bold text-[#002b5c]">
            {books.length} books
          </span>
        </div>

        {books.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-10 text-center ring-1 ring-slate-200">
            <BookOpen className="mx-auto text-slate-400" size={42} />
            <h3 className="mt-4 text-xl font-extrabold text-[#002b5c]">
              No books registered yet
            </h3>
            <p className="mt-2 text-slate-500">
              Create your first book using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {books.map((book) => {
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
                    <BookDetail icon={<UserRound size={17} />} text={book.author?.name || "Unknown author"} />
                    <BookDetail icon={<Tags size={17} />} text={book.category?.name || "General category"} />
                    <BookDetail icon={<BookOpen size={17} />} text={`${availableCopies} available copies`} />
                  </div>

                  {book.isbn && (
                    <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200">
                      ISBN: <span className="font-bold text-[#002b5c]">{book.isbn}</span>
                    </p>
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