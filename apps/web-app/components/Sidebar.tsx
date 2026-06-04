"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/library",
    label: "Library",
    icon: BookOpen,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="hidden min-h-screen w-72 bg-campus-navy text-white md:flex md:flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 p-6">
        <div className="rounded-xl bg-campus-gold p-3 text-campus-navy">
          <GraduationCap />
        </div>
        <div>
          <h1 className="text-lg font-bold">Smart Campus</h1>
          <p className="text-sm text-white/70">Module 3</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition",
                active
                  ? "bg-campus-gold text-campus-navy"
                  : "text-white/80 hover:bg-white/10"
              )}
            >
              <Icon size={20} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="m-4 flex items-center gap-3 rounded-xl px-4 py-3 text-white/80 transition hover:bg-white/10"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}