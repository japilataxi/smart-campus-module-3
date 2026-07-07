"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Building2,
  BusFront,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  NotebookTabs,
  QrCode,
  Shield,
  Tags,
  User,
  Users,
  WalletCards,
  Info,
Workflow,
  Megaphone,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

const groupedMenuByRole = {
  student: [
    {
      title: "Overview",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/notifications", label: "Notifications", icon: Bell },
        { href: "/profile", label: "Profile", icon: User },
      ],
    },
    {
      title: "Microservices",
      items: [
        { href: "/library", label: "Library Service", icon: BookOpen },
        { href: "/incidents", label: "Incident Service", icon: AlertTriangle },
        { href: "/qr-access", label: "QR Access Service", icon: QrCode },
        { href: "/transport", label: "Transport Service", icon: BusFront },
        {
          href: "/space-availability",
          label: "Space Service",
          icon: Building2,
        },
        { href: "/announcements", label: "Announcement Service", icon: Megaphone },
      ],
    },
    {
      title: "Library Service",
      items: [
        { href: "/library", label: "Catalog", icon: BookOpen },
        { href: "/loans", label: "My Loans", icon: WalletCards },
      ],
    },
  ],
  librarian: [
    {
      title: "Overview",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/notifications", label: "Notifications", icon: Bell },
        { href: "/profile", label: "Profile", icon: User },
      ],
    },
    {
      title: "Microservices",
      items: [
        { href: "/library", label: "Library Service", icon: BookOpen },
        { href: "/incidents", label: "Incident Service", icon: AlertTriangle },
        { href: "/qr-access", label: "QR Access Service", icon: QrCode },
        { href: "/transport", label: "Transport Service", icon: BusFront },
        {
          href: "/space-availability",
          label: "Space Service",
          icon: Building2,
        },
        { href: "/announcements", label: "Announcement Service", icon: Megaphone },
      ],
    },
    {
      title: "Library Service",
      items: [
        { href: "/library", label: "Catalog", icon: BookOpen },
        { href: "/loans", label: "Loans", icon: WalletCards },
        { href: "/manage/books", label: "Books", icon: LibraryBig },
        { href: "/manage/authors", label: "Authors", icon: NotebookTabs },
        { href: "/manage/categories", label: "Categories", icon: Tags },
      ],
    },
  ],
  admin: [
    {
      title: "Overview",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/notifications", label: "Notifications", icon: Bell },
        { href: "/profile", label: "Profile", icon: User },
      ],
    },
    {
      title: "Microservices",
      items: [
        { href: "/admin/users", label: "Auth Service", icon: Shield },
        { href: "/library", label: "Library Service", icon: BookOpen },
        { href: "/notifications", label: "Notification Service", icon: Bell },
        { href: "/workflows", label: "Workflow Service", icon: Workflow },
        { href: "/incidents", label: "Incident Service", icon: AlertTriangle },
        { href: "/qr-access", label: "QR Access Service", icon: QrCode },
        { href: "/transport", label: "Transport Service", icon: BusFront },
        {
          href: "/space-availability",
          label: "Space Service",
          icon: Building2,
        },
        { href: "/announcements", label: "Announcement Service", icon: Megaphone },
      ],
    },
    {
      title: "Library Service",
      items: [
        { href: "/library", label: "Catalog", icon: BookOpen },
        { href: "/loans", label: "Loans", icon: WalletCards },
        { href: "/manage/books", label: "Books", icon: LibraryBig },
        { href: "/manage/authors", label: "Authors", icon: NotebookTabs },
        { href: "/manage/categories", label: "Categories", icon: Tags },
      ],
    },
    {
      title: "Administration",
      items: [
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/roles", label: "Roles", icon: Shield },
      ],
    },
    {
      title: "Architecture & QA",
      items: [{ href: "/system-info", label: "System Info", icon: Info }],
    },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { logout, primaryRole } = useAuth();

  const groups =
    groupedMenuByRole[primaryRole as keyof typeof groupedMenuByRole] ??
    groupedMenuByRole.student;

  return (
    <aside className="hidden min-h-screen w-72 bg-gradient-to-b from-[#002b5c] via-[#003b7a] to-[#8b0000] text-white md:flex md:flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 p-5">
        <div className="rounded-xl bg-[#f4c430] p-3 text-[#002b5c]">
          <GraduationCap size={22} />
        </div>

        <div>
          <h1 className="text-lg font-bold">Smart Campus</h1>
          <p className="text-sm capitalize text-white/70">
            {primaryRole} panel
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto p-4">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-4 text-xs font-extrabold uppercase tracking-[0.18em] text-white/45">
              {group.title}
            </p>

            <div className="space-y-1.5">
              {group.items.map((link) => {
                const Icon = link.icon;
                const active =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={`${group.title}-${link.href}-${link.label}`}
                    href={link.href}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                      active
                        ? "bg-[#f4c430] text-[#002b5c] shadow-lg"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon size={18} />
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
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
