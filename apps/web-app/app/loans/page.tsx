"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";

export default function LoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [bookId, setBookId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setError("");

    try {
      setLoading(true);

      await api.createLoan({
        bookId,
        userEmail,
      });

      setBookId("");
      await loadData();
    } catch (error) {
      console.error(error);
      setError("Unable to create loan.");
    } finally {
      setLoading(false);
    }
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

        <h1 className="mt-3 text-4xl font-extrabold">
          Book Loans
        </h1>

        <p className="mt-2 text-white/75">
          Review and create book loan operations.
        </p>
      </div>

      <form
        onSubmit={createLoan}
        className="mt-8 flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:flex-row"
      >
        <input
          className="input flex-1"
          type="email"
          placeholder="student@uce.edu.ec"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />

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

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#002b5c] px-8 py-3 font-bold text-white transition hover:bg-[#003b7a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Loan"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <section className="mt-8 overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full min-w-[700px] text-left">
          <thead className="bg-[#002b5c] text-white">
            <tr>
              <th className="p-4">Book</th>
              <th className="p-4">Status</th>
              <th className="p-4">Loan Date</th>
              <th className="p-4">Return Date</th>
            </tr>
          </thead>

          <tbody>
            {loans.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-slate-500"
                >
                  No loans found.
                </td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr
                  key={loan.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="p-4 font-bold text-[#002b5c]">
                    {loan.book?.title ||
                      loan.bookId ||
                      "Unknown book"}
                  </td>

                  <td className="p-4">
                    {loan.status || "active"}
                  </td>

                  <td className="p-4">
                    {loan.loanDate
                      ? new Date(loan.loanDate).toLocaleDateString()
                      : "Not registered"}
                  </td>

                  <td className="p-4">
                    {loan.returnDate
                      ? new Date(loan.returnDate).toLocaleDateString()
                      : "Pending"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}