"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  User,
  Users,
  Shield,
  LibraryBig,
  Tags,
  NotebookTabs,
  WalletCards,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

const menuByRole = {
  student: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/library", label: "Library", icon: BookOpen },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/loans", label: "My Loans", icon: WalletCards },
  ],
  librarian: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/library", label: "Library", icon: BookOpen },
    { href: "/manage/books", label: "Manage Books", icon: LibraryBig },
    { href: "/manage/authors", label: "Manage Authors", icon: NotebookTabs },
    { href: "/manage/categories", label: "Manage Categories", icon: Tags },
    { href: "/loans", label: "Loans", icon: Shield },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/loans", label: "Loans", icon: WalletCards },
  ],
  admin: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/roles", label: "Roles", icon: Shield },
    { href: "/library", label: "Library", icon: BookOpen },
    { href: "/manage/books", label: "Manage Books", icon: LibraryBig },
    { href: "/manage/authors", label: "Manage Authors", icon: NotebookTabs },
    { href: "/manage/categories", label: "Manage Categories", icon: Tags },
    { href: "/loans", label: "Loans", icon: Shield },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/loans", label: "Loans", icon: WalletCards },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { logout, primaryRole } = useAuth();

  const links = menuByRole[primaryRole];

  return (
    <aside className="hidden min-h-screen w-72 bg-gradient-to-b from-[#002b5c] via-[#003b7a] to-[#8b0000] text-white md:flex md:flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 p-6">
        <div className="rounded-xl bg-[#f4c430] p-3 text-[#002b5c]">
          <GraduationCap />
        </div>

        <div>
          <h1 className="text-lg font-bold">Smart Campus</h1>
          <p className="text-sm capitalize text-white/70">
            {primaryRole} panel
          </p>
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
                  ? "bg-[#f4c430] text-[#002b5c]"
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