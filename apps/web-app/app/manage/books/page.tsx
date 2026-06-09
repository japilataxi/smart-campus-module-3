"use client";

import { useEffect, useState } from "react";
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

  return (
    <AppShell>
      <div className="rounded-3xl bg-gradient-to-r from-[#002b5c] to-[#8b0000] p-8 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Library Management
        </p>
        <h1 className="mt-3 text-4xl font-extrabold">Manage Books</h1>
        <p className="mt-2 text-white/75">
          Register books connected with authors and categories.
        </p>
      </div>

      <form
        onSubmit={createBook}
        className="mt-8 grid gap-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:grid-cols-2"
      >
        <input className="input" placeholder="Book title" value={form.title} onChange={(e) => updateField("title", e.target.value)} required />
        <input className="input" placeholder="ISBN" value={form.isbn} onChange={(e) => updateField("isbn", e.target.value)} />

        <select className="input" value={form.authorId} onChange={(e) => updateField("authorId", e.target.value)}>
          <option value="">Select author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>{author.name}</option>
          ))}
        </select>

        <select className="input" value={form.categoryId} onChange={(e) => updateField("categoryId", e.target.value)}>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>

        <input className="input" type="number" min={1} placeholder="Total copies" value={form.totalCopies} onChange={(e) => updateField("totalCopies", Number(e.target.value))} />

        <button className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white md:col-span-2">
          Create Book
        </button>
      </form>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {books.map((book) => (
          <div key={book.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-xl font-bold text-[#002b5c]">{book.title}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {book.author?.name || "Unknown author"} · {book.category?.name || "General"}
            </p>
            <p className="mt-4 rounded-full bg-[#f4c430]/20 px-3 py-2 text-center text-sm font-bold text-[#002b5c]">
              {book.availableCopies ?? 0} available copies
            </p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}