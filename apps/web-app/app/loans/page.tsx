"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";

export default function LoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [bookId, setBookId] = useState("");

  async function loadData() {
    const [loansData, booksData] = await Promise.all([
      api.getLoans(),
      api.getBooks(),
    ]);

    setLoans(loansData);
    setBooks(booksData);
  }

  async function createLoan(event: React.FormEvent) {
    event.preventDefault();

    await api.createLoan({
      bookId,
    });

    setBookId("");
    await loadData();
  }

  useEffect(() => {
    loadData().catch(() => {
      setLoans([]);
      setBooks([]);
    });
  }, []);

  return (
    <AppShell>
      <div className="rounded-3xl bg-gradient-to-r from-[#002b5c] to-[#8b0000] p-8 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Library Service
        </p>
        <h1 className="mt-3 text-4xl font-extrabold">Book Loans</h1>
        <p className="mt-2 text-white/75">
          Review and create book loan operations.
        </p>
      </div>

      <form
        onSubmit={createLoan}
        className="mt-8 flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:flex-row"
      >
        <select
          className="input flex-1"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
        >
          <option value="">Select book</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>

        <button className="rounded-xl bg-[#002b5c] px-8 py-3 font-bold text-white">
          Create Loan
        </button>
      </form>

      <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-left">
          <thead className="bg-[#002b5c] text-white">
            <tr>
              <th className="p-4">Book</th>
              <th className="p-4">Status</th>
              <th className="p-4">Loan Date</th>
              <th className="p-4">Return Date</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} className="border-b border-slate-100">
                <td className="p-4 font-bold text-[#002b5c]">
                  {loan.book?.title || loan.bookId || "Unknown book"}
                </td>
                <td className="p-4">{loan.status || "active"}</td>
                <td className="p-4">{loan.loanDate || "Not registered"}</td>
                <td className="p-4">{loan.returnDate || "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}