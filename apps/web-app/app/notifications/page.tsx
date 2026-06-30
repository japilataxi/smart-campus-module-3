"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { io } from "socket.io-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3010";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`${API_URL}/notifications`);

        const data = await response.json();

          if (!response.ok) {
            console.error("Notifications API error:", data);
            setNotifications([]);
            return;
          }

          setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);

  useEffect(() => {
    const token =
      localStorage.getItem("smart_campus_access_token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");

    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ["websocket"],
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error.message);
    });

    socket.on("notification:new", (notification) => {
      console.log("notification:new", notification);
      setNotifications((current) => [notification, ...current]);
    });

    socket.on("notification:unread-count", (data) => {
      console.log("notification:unread-count", data);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    return () => {
      socket.disconnect();
    };
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