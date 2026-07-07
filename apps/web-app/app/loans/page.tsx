"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Mail,
  RotateCcw,
  WalletCards,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { isLibrarian, isStudent } from "@/lib/roles";

type MessageType = "success" | "error";

export default function LoansPage() {
  const { user } = useAuth();

  const [loans, setLoans] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [bookId, setBookId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("success");

  async function loadData() {
    const [loansData, booksData] = await Promise.all([
      api.getLoans(),
      api.getBooks(),
    ]);

    setBooks(booksData);

    if (isStudent(user)) {
      setLoans(loansData.filter((loan: any) => loan.userEmail === user?.email));
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

      setMessageType("success");
      setMessage("Loan created successfully.");
      setBookId("");
      await loadData();
    } catch {
      setMessageType("error");
      setMessage("The loan could not be created. Please try again.");
    }
  }

  async function returnLoan(loanId: string) {
    try {
      await api.returnLoan(loanId);
      setMessageType("success");
      setMessage("Loan returned successfully.");
      await loadData();
    } catch {
      setMessageType("error");
      setMessage("The loan could not be returned. Please try again.");
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

  const activeLoans = loans.filter((loan) => !loan.returned);
  const returnedLoans = loans.filter((loan) => loan.returned);

  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Library Service
        </p>

        <h1 className="mt-4 text-5xl font-extrabold">
          {isStudent(user) ? "My Loans" : "Book Loans"}
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-white/80">
          {isStudent(user)
            ? "Review your requested books, current loans and return status."
            : "Create book loans, review active operations and register book returns."}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Badge text="Loan Requests" />
          <Badge text="Book Availability" />
          <Badge text="Return Control" />
          <Badge text="Library Operations" />
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <InfoCard
          icon={<WalletCards />}
          title="Total Loans"
          value={loans.length}
          text="Loan records visible for the current role."
        />

        <InfoCard
          icon={<Clock />}
          title="Active Loans"
          value={activeLoans.length}
          text="Loans that are currently pending return."
        />

        <InfoCard
          icon={<CheckCircle2 />}
          title="Returned Loans"
          value={returnedLoans.length}
          text="Loans already marked as returned."
        />
      </section>

      {message && <AlertMessage type={messageType} message={message} />}

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-[#002b5c]">
            Create Loan
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Select an available book and register a new loan operation.
          </p>
        </div>

        <form onSubmit={createLoan} className="grid gap-4 md:grid-cols-3">
          {!isStudent(user) && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 focus-within:border-[#f4c430]">
              <Mail size={20} className="text-slate-400" />
              <input
                className="w-full bg-transparent outline-none"
                placeholder="Student email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div
            className={`flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 focus-within:border-[#f4c430] ${
              isStudent(user) ? "md:col-span-2" : ""
            }`}
          >
            <BookOpen size={20} className="text-slate-400" />
            <select
              className="w-full bg-transparent outline-none"
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
          </div>

          <button className="rounded-xl bg-[#002b5c] px-8 py-3 font-bold text-white shadow-sm transition hover:bg-[#003b7a]">
            Create Loan
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-[#002b5c]">
              Loan Records
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review book loans, due dates, current status and return actions.
            </p>
          </div>

          <span className="rounded-full bg-[#002b5c]/10 px-4 py-2 text-sm font-bold text-[#002b5c]">
            {loans.length} records
          </span>
        </div>

        {loans.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-10 text-center ring-1 ring-slate-200">
            <WalletCards className="mx-auto text-slate-400" size={42} />
            <h3 className="mt-4 text-xl font-extrabold text-[#002b5c]">
              No loan records found
            </h3>
            <p className="mt-2 text-slate-500">
              Once a loan is created, it will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="text-sm uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2">Book</th>
                  <th className="px-4 py-2">User Email</th>
                  <th className="px-4 py-2">Loan Date</th>
                  <th className="px-4 py-2">Due Date</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Return</th>
                  <th className="px-4 py-2">Actions</th>
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
                    <tr key={loan.id} className="bg-slate-50">
                      <td className="rounded-l-2xl px-4 py-4">
                        <p className="font-bold text-[#002b5c]">{bookTitle}</p>
                        <p className="text-xs text-slate-500">Library book</p>
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {loan.userEmail}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {formatDate(loan.loanDate || loan.createdAt)}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {formatDate(loan.dueDate)}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge returned={loan.returned} />
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {loan.returnDate || loan.returned
                          ? "Returned"
                          : "Pending"}
                      </td>

                      <td className="rounded-r-2xl px-4 py-4">
                        {isLibrarian(user) && !loan.returned ? (
                          <button
                            onClick={() => returnLoan(loan.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#002b5c] px-4 py-2 font-bold text-white transition hover:bg-[#003b7a]"
                          >
                            <RotateCcw size={16} />
                            Return
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

function StatusBadge({ returned }: { returned: boolean }) {
  return returned ? (
    <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700 ring-1 ring-green-200">
      Returned
    </span>
  ) : (
    <span className="rounded-full bg-yellow-50 px-3 py-1 text-sm font-bold text-yellow-700 ring-1 ring-yellow-200">
      Active
    </span>
  );
}

function AlertMessage({
  type,
  message,
}: {
  type: MessageType;
  message: string;
}) {
  const success = type === "success";

  return (
    <div
      className={`mt-6 flex items-start gap-3 rounded-xl p-4 text-sm font-medium ring-1 ${
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

function formatDate(value?: string) {
  if (!value) return "Not registered";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString();
}