import Link from "next/link";
import { Book } from "@/lib/types";

export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/library/${book.id}`}
      className="block rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-campus-navy text-xl font-bold text-campus-gold">
        {book.title?.charAt(0) || "B"}
      </div>

      <h3 className="text-lg font-bold text-campus-navy">{book.title}</h3>

      <p className="mt-2 text-sm text-slate-500">
        {book.author?.name || "Unknown author"}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {book.category?.name || "General category"}
      </p>

      <div className="mt-4 rounded-full bg-green-100 px-3 py-1 text-center text-sm font-medium text-green-700">
        {book.availableCopies ?? 0} copies available
      </div>
    </Link>
  );
}