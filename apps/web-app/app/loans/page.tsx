"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { isLibrarian, isStudent } from "@/lib/roles";

export default function LoansPage() {
  const { user } = useAuth();

  const [loans, setLoans] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [bookId, setBookId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    const [loansData, booksData] = await Promise.all([
      api.getLoans(),
      api.getBooks(),
    ]);

    setBooks(booksData);

    if (isStudent(user)) {
      setLoans(
        loansData.filter((loan: any) => loan.userEmail === user?.email)
      );
    } else {
      setLoans(loansData);
    }
  }

  async function createLoan(event: React.FormEvent) {
    event.preventDefault();

    const email = isStudent(user) ? user?.email : userEmail;

    if (!email || !bookId) return;

    try {
      await api.createLoan({
        userEmail: email,
        bookId,
      });

      setMessage("Loan created successfully.");
      setBookId("");
      await loadData();
    } catch {
      setMessage("Could not create loan.");
    }
  }

  async function returnLoan(loanId: string) {
    try {
      await api.returnLoan(loanId);
      setMessage("Loan returned successfully.");
      await loadData();
    } catch {
      setMessage("Could not return loan.");
    }
  }

  useEffect(() => {
    if (user) {
      loadData().catch(() => {
        setLoans([]);
        setBooks([]);
      });
    }
  }, [user]);

  return (
    <AppShell>
      <div className="rounded-3xl bg-gradient-to-r from-[#002b5c] to-[#8b0000] p-8 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Library Service
        </p>
        <h1 className="mt-3 text-4xl font-extrabold">
          {isStudent(user) ? "My Loans" : "Book Loans"}
        </h1>
        <p className="mt-2 text-white/75">
          Review loan operations and manage book returns.
        </p>
      </div>

      {message && (
        <div className="mt-6 rounded-xl bg-[#f4c430]/20 p-4 font-bold text-[#002b5c]">
          {message}
        </div>
      )}

      <form
        onSubmit={createLoan}
        className="mt-8 flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:flex-row"
      >
        {!isStudent(user) && (
          <input
            className="input flex-1"
            placeholder="Student email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        )}

        <select
          className="input flex-1"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
        >
          <option value="">Select book</option>
          {books.map((book) => (
            <option
              key={book.id}
              value={book.id}
              disabled={(book.availableCopies ?? 0) <= 0}
            >
              {book.title} - {book.availableCopies ?? 0} available
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
              <th className="p-4">User Email</th>
              <th className="p-4">Loan Date</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Return Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loans.map((loan) => {
              const bookTitle =
                loan.book?.title ||
                books.find((book) => book.id === loan.bookId)?.title ||
                loan.bookId ||
                "Unknown book";

              return (
                <tr key={loan.id} className="border-b border-slate-100">
                  <td className="p-4 font-bold text-[#002b5c]">
                    {bookTitle}
                  </td>
                  <td className="p-4">{loan.userEmail}</td>
                  <td className="p-4">
                    {loan.loanDate || loan.createdAt || "Not registered"}
                  </td>
                  <td className="p-4">{loan.dueDate || "Not registered"}</td>
                  <td className="p-4">
                    {loan.returned ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 font-bold text-green-700">
                        Returned
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 font-bold text-yellow-700">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {loan.returnDate || loan.returned ? "Returned" : "Pending"}
                  </td>
                  <td className="p-4">
                    {isLibrarian(user) && !loan.returned ? (
                      <button
                        onClick={() => returnLoan(loan.id)}
                        className="rounded-xl bg-[#002b5c] px-4 py-2 font-bold text-white"
                      >
                        Return Loan
                      </button>
                    ) : (
                      <span className="text-sm text-slate-400">
                        No action
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}