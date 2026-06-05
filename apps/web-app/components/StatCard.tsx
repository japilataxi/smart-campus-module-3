import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description: string;
}

export function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
          {title}
        </p>

        <div className="rounded-2xl bg-[#f4c430]/20 p-4 text-[#002b5c]">
          {icon}
        </div>
      </div>

      <h3 className="text-5xl font-extrabold text-[#002b5c]">{value}</h3>
      <p className="mt-3 text-sm text-slate-500">{description}</p>
    </div>
  );
}