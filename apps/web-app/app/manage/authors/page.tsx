"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";

export default function ManageAuthorsPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [biography, setBiography] = useState("");

  async function loadAuthors() {
    const data = await api.getAuthors();
    setAuthors(data);
  }

  async function createAuthor(event: React.FormEvent) {
    event.preventDefault();

    await api.createAuthor({
      name,
      biography,
    });

    setName("");
    setBiography("");
    await loadAuthors();
  }

  useEffect(() => {
    loadAuthors().catch(() => setAuthors([]));
  }, []);

  return (
    <AppShell>
      <Header title="Manage Authors" subtitle="Create and review academic authors." />

      <form
        onSubmit={createAuthor}
        className="mt-8 grid gap-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:grid-cols-2"
      >
        <input
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]"
          placeholder="Author name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]"
          placeholder="Biography"
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
        />

        <button className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white md:col-span-2">
          Create Author
        </button>
      </form>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {authors.map((author) => (
          <div key={author.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-xl font-bold text-[#002b5c]">{author.name}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {author.biography || "No biography registered."}
            </p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-[#002b5c] to-[#8b0000] p-8 text-white">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
        Library Management
      </p>
      <h1 className="mt-3 text-4xl font-extrabold">{title}</h1>
      <p className="mt-2 text-white/75">{subtitle}</p>
    </div>
  );
}