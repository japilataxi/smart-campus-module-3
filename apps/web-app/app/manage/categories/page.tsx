"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
    setDescription("");
    await loadCategories();
  }

  useEffect(() => {
    loadCategories().catch(() => setCategories([]));
  }, []);

  return (
    <AppShell>
      <div className="rounded-3xl bg-gradient-to-r from-[#002b5c] to-[#8b0000] p-8 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Library Management
        </p>
        <h1 className="mt-3 text-4xl font-extrabold">Manage Categories</h1>
        <p className="mt-2 text-white/75">
          Create and review book classification categories.
        </p>
      </div>

      <form
        onSubmit={createCategory}
        className="mt-8 grid gap-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:grid-cols-2"
      >
        <input
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white md:col-span-2">
          Create Category
        </button>
      </form>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-xl font-bold text-[#002b5c]">{category.name}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {category.description || "No description registered."}
            </p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}