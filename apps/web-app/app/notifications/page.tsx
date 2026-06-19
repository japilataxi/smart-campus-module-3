"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/notifications"
        );

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);

  return (
    <AppShell>
      <h1 className="text-4xl font-bold mb-6">
        Notifications
      </h1>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="rounded-xl bg-white p-4 shadow"
          >
            <h2 className="font-bold">
              {n.title}
            </h2>

            <p>{n.message}</p>

            <p className="text-sm text-gray-500">
              {n.sourceService}
            </p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}