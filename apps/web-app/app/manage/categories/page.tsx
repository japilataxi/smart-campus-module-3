"use client";

import { useEffect, useState } from "react";
import { Tags, LibraryBig } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");

  async function loadCategories() {
    const data = await api.getCategories();
    setCategories(data);
  }

  async function createCategory(event: React.FormEvent) {
    event.preventDefault();

    await api.createCategory({
      name,
    });

    setName("");
    await loadCategories();
  }

  useEffect(() => {
    loadCategories().catch(() => setCategories([]));
  }, []);

  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Library Management
        </p>

        <h1 className="mt-4 text-5xl font-extrabold">Manage Categories</h1>

        <p className="mt-4 max-w-3xl text-lg text-white/80">
          Create and review book classification categories used by the Library
          Service.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <InfoCard
          icon={<Tags />}
          title="Total Categories"
          value={categories.length}
          text="Classification groups registered in the catalog."
        />

        <InfoCard
          icon={<LibraryBig />}
          title="Library Catalog"
          value="Active"
          text="Categories help organize books for search and loan operations."
        />
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-[#002b5c]">
            Create Category
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Add a new classification category to organize books in the catalog.
          </p>
        </div>

        <form onSubmit={createCategory} className="grid gap-4 md:grid-cols-[1fr_auto]">
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <button className="rounded-xl bg-[#002b5c] px-8 py-3 font-bold text-white transition hover:bg-[#003b7a]">
            Create Category
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-[#002b5c]">
              Category Records
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review all book categories available in the Library Service.
            </p>
          </div>

          <span className="rounded-full bg-[#002b5c]/10 px-4 py-2 text-sm font-bold text-[#002b5c]">
            {categories.length} categories
          </span>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-10 text-center ring-1 ring-slate-200">
            <Tags className="mx-auto text-slate-400" size={42} />
            <h3 className="mt-4 text-xl font-extrabold text-[#002b5c]">
              No categories registered yet
            </h3>
            <p className="mt-2 text-slate-500">
              Create your first category using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200 transition hover:bg-white hover:shadow-md"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-[#f4c430]/20 p-4 text-[#002b5c]">
                  <Tags />
                </div>

                <h3 className="text-xl font-extrabold text-[#002b5c]">
                  {category.name}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Book classification category.
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