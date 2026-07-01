"use client";

import { useEffect, useState } from "react";
import { BookOpen, PenLine, UserRound } from "lucide-react";
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
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Library Management
        </p>

        <h1 className="mt-4 text-5xl font-extrabold">Manage Authors</h1>

        <p className="mt-4 max-w-3xl text-lg text-white/80">
          Create and review academic authors used to organize books in the
          Library Service catalog.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <InfoCard
          icon={<UserRound />}
          title="Total Authors"
          value={authors.length}
          text="Authors registered in the library catalog."
        />

        <InfoCard
          icon={<BookOpen />}
          title="Library Catalog"
          value="Active"
          text="Authors can be assigned to books during registration."
        />
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-[#002b5c]">
            Create Author
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Register a new author and optionally include a short biography.
          </p>
        </div>

        <form onSubmit={createAuthor} className="grid gap-4 md:grid-cols-2">
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

          <button className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white transition hover:bg-[#003b7a] md:col-span-2">
            Create Author
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-[#002b5c]">
              Author Records
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review all authors available for book registration.
            </p>
          </div>

          <span className="rounded-full bg-[#002b5c]/10 px-4 py-2 text-sm font-bold text-[#002b5c]">
            {authors.length} authors
          </span>
        </div>

        {authors.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-10 text-center ring-1 ring-slate-200">
            <UserRound className="mx-auto text-slate-400" size={42} />
            <h3 className="mt-4 text-xl font-extrabold text-[#002b5c]">
              No authors registered yet
            </h3>
            <p className="mt-2 text-slate-500">
              Create your first author using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {authors.map((author) => (
              <div
                key={author.id}
                className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200 transition hover:bg-white hover:shadow-md"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-[#f4c430]/20 p-4 text-[#002b5c]">
                  <PenLine />
                </div>

                <h3 className="text-xl font-extrabold text-[#002b5c]">
                  {author.name}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {author.biography || "No biography registered."}
                </p>
              </div>
            ))}
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