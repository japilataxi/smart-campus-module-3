"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { api, getAccessToken } from "@/lib/api";
import { normalizeRoles } from "@/lib/roles";

type RouteStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";
type VehicleStatus = "AVAILABLE" | "IN_SERVICE" | "MAINTENANCE" | "OUT_OF_SERVICE";
type ScheduleStatus = "SCHEDULED" | "DELAYED" | "CANCELLED" | "COMPLETED";

type TransportRoute = {
  id: string;
  name: string;
  description?: string;
  origin: string;
  destination: string;
  status: RouteStatus;
  createdAt?: string;
};

type TransportStop = {
  id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  routeId?: string;
};

type TransportVehicle = {
  id: string;
  code: string;
  plate: string;
  capacity: number;
  status: VehicleStatus;
  currentRouteId?: string;
};

type TransportSchedule = {
  id: string;
  routeId: string;
  vehicleId?: string;
  departureTime: string;
  arrivalTime: string;
  status: ScheduleStatus;
};

type RouteAvailability = {
  routeId: string;
  routeName: string;
  available: boolean;
  status: RouteStatus;
  message: string;
  nextDepartures?: TransportSchedule[];
};

const routeFormInitial = {
  name: "",
  description: "",
  origin: "",
  destination: "",
  status: "ACTIVE" as RouteStatus,
};

const stopFormInitial = {
  name: "",
  location: "",
  latitude: "",
  longitude: "",
  routeId: "",
};

const vehicleFormInitial = {
  code: "",
  plate: "",
  capacity: "40",
  status: "AVAILABLE" as VehicleStatus,
  currentRouteId: "",
};

const scheduleFormInitial = {
  routeId: "",
  vehicleId: "",
  departureTime: "",
  arrivalTime: "",
  status: "SCHEDULED" as ScheduleStatus,
};

function normalizeRoute(record: any): TransportRoute {
  return {
    id: String(record.id),
    name: String(record.name || ""),
    description: record.description || "",
    origin: String(record.origin || ""),
    destination: String(record.destination || ""),
    status: String(record.status || "ACTIVE").toUpperCase() as RouteStatus,
    createdAt: record.createdAt,
  };
}

function normalizeStop(record: any): TransportStop {
  return {
    id: String(record.id),
    name: String(record.name || ""),
    location: String(record.location || ""),
    latitude: record.latitude,
    longitude: record.longitude,
    routeId: record.routeId,
  };
}

function normalizeVehicle(record: any): TransportVehicle {
  return {
    id: String(record.id),
    code: String(record.code || ""),
    plate: String(record.plate || ""),
    capacity: Number(record.capacity || 0),
    status: String(record.status || "AVAILABLE").toUpperCase() as VehicleStatus,
    currentRouteId: record.currentRouteId,
  };
}

function normalizeSchedule(record: any): TransportSchedule {
  return {
    id: String(record.id),
    routeId: String(record.routeId || ""),
    vehicleId: record.vehicleId,
    departureTime: String(record.departureTime || ""),
    arrivalTime: String(record.arrivalTime || ""),
    status: String(record.status || "SCHEDULED").toUpperCase() as ScheduleStatus,
  };
}

function formatDate(value?: string) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.name === "401") {
      return "Your session has expired. Please sign in again.";
    }

    if (error.name === "403") {
      return "You do not have permission to perform this action.";
    }

    if (
      error.message === "Failed to fetch" ||
      error.message.toLowerCase().includes("fetch")
    ) {
      return "Transport Service is currently unavailable. Please try again in a few moments.";
    }

    return "Unable to complete the requested operation. Please try again.";
  }

  return "An unexpected error occurred. Please try again.";
}

function routeBadgeClass(status: RouteStatus) {
  const classes: Record<RouteStatus, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-slate-100 text-slate-700",
    MAINTENANCE: "bg-yellow-100 text-yellow-700",
  };

  return `rounded-full px-3 py-1 text-xs font-bold ${classes[status]}`;
}

function vehicleBadgeClass(status: VehicleStatus) {
  const classes: Record<VehicleStatus, string> = {
    AVAILABLE: "bg-green-100 text-green-700",
    IN_SERVICE: "bg-blue-100 text-blue-700",
    MAINTENANCE: "bg-yellow-100 text-yellow-700",
    OUT_OF_SERVICE: "bg-red-100 text-red-700",
  };

  return `rounded-full px-3 py-1 text-xs font-bold ${classes[status]}`;
}

function scheduleBadgeClass(status: ScheduleStatus) {
  const classes: Record<ScheduleStatus, string> = {
    SCHEDULED: "bg-green-100 text-green-700",
    DELAYED: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-700",
    COMPLETED: "bg-blue-100 text-blue-700",
  };

  return `rounded-full px-3 py-1 text-xs font-bold ${classes[status]}`;
}

export default function TransportPage() {
  const router = useRouter();
  const { user } = useAuth();
  const roles = useMemo(() => normalizeRoles(user), [user]);
  const canManage = roles.includes("admin") || roles.includes("librarian") || roles.includes("staff");

  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [stops, setStops] = useState<TransportStop[]>([]);
  const [vehicles, setVehicles] = useState<TransportVehicle[]>([]);
  const [schedules, setSchedules] = useState<TransportSchedule[]>([]);
  const [availability, setAvailability] = useState<RouteAvailability | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [routeForm, setRouteForm] = useState(routeFormInitial);
  const [stopForm, setStopForm] = useState(stopFormInitial);
  const [vehicleForm, setVehicleForm] = useState(vehicleFormInitial);
  const [scheduleForm, setScheduleForm] = useState(scheduleFormInitial);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleAuthError(errorValue: unknown) {
    if (errorValue instanceof Error && errorValue.name === "401") {
      router.push("/login");
    }
  }

  async function loadTransportData(routeId = selectedRouteId) {
    setLoading(true);
    setError("");

    try {
      const [routesData, stopsData, vehiclesData, schedulesData] = await Promise.all([
        api.getTransportRoutes(),
        api.getTransportStops(routeId || undefined),
        api.getTransportVehicles(),
        api.getTransportSchedules(routeId || undefined),
      ]);

      setRoutes(routesData.map(normalizeRoute));
      setStops(stopsData.map(normalizeStop));
      setVehicles(vehiclesData.map(normalizeVehicle));
      setSchedules(schedulesData.map(normalizeSchedule));
    } catch (errorValue) {
      handleAuthError(errorValue);
      setError(getErrorMessage(errorValue));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getAccessToken()) {
      router.push("/login");
      return;
    }

    loadTransportData();
  }, [router]);

  async function createRoute(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.createTransportRoute(routeForm);
      setRouteForm(routeFormInitial);
      setMessage("Transport route created successfully.");
      await loadTransportData();
    } catch (errorValue) {
      handleAuthError(errorValue);
      setError(getErrorMessage(errorValue));
    }
  }

  async function createStop(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.createTransportStop({
        name: stopForm.name,
        location: stopForm.location,
        routeId: stopForm.routeId || undefined,
        latitude: stopForm.latitude ? Number(stopForm.latitude) : undefined,
        longitude: stopForm.longitude ? Number(stopForm.longitude) : undefined,
      });
      setStopForm(stopFormInitial);
      setMessage("Transport stop created successfully.");
      await loadTransportData();
    } catch (errorValue) {
      handleAuthError(errorValue);
      setError(getErrorMessage(errorValue));
    }
  }

  async function createVehicle(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.createTransportVehicle({
        code: vehicleForm.code,
        plate: vehicleForm.plate,
        capacity: Number(vehicleForm.capacity),
        status: vehicleForm.status,
        currentRouteId: vehicleForm.currentRouteId || undefined,
      });
      setVehicleForm(vehicleFormInitial);
      setMessage("Transport vehicle created successfully.");
      await loadTransportData();
    } catch (errorValue) {
      handleAuthError(errorValue);
      setError(getErrorMessage(errorValue));
    }
  }

  async function createSchedule(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.createTransportSchedule({
        routeId: scheduleForm.routeId,
        vehicleId: scheduleForm.vehicleId || undefined,
        departureTime: new Date(scheduleForm.departureTime).toISOString(),
        arrivalTime: new Date(scheduleForm.arrivalTime).toISOString(),
        status: scheduleForm.status,
      });
      setScheduleForm(scheduleFormInitial);
      setMessage("Transport schedule created successfully.");
      await loadTransportData();
    } catch (errorValue) {
      handleAuthError(errorValue);
      setError(getErrorMessage(errorValue));
    }
  }

  async function checkAvailability(routeId: string) {
    if (!routeId) {
      setError("Select a route to check availability.");
      return;
    }

    setError("");
    setMessage("");

    try {
      const data = await api.getTransportRouteAvailability(routeId);
      setAvailability(data);
      setMessage(data.available ? "Route is available." : data.message || "Route is not available.");
    } catch (errorValue) {
      handleAuthError(errorValue);
      setError(getErrorMessage(errorValue));
    }
  }

  async function filterByRoute(routeId: string) {
    setSelectedRouteId(routeId);
    await loadTransportData(routeId);
    if (routeId) await checkAvailability(routeId);
    else setAvailability(null);
  }

  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-8 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Transport Service
        </p>
        <h1 className="mt-3 text-4xl font-extrabold">Transport Management</h1>
        <p className="mt-2 text-white/75">
          Manage campus routes, stops, vehicles, schedules, and route availability.
        </p>
      </section>

      {message && (
        <div className="mt-6 rounded-xl bg-[#f4c430]/20 p-4 font-bold text-[#002b5c]">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 font-bold text-red-700 ring-1 ring-red-100">
          {error}
        </div>
      )}

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#002b5c]">Route Availability</h2>
              <p className="text-sm text-slate-500">Filter routes and schedules by campus route.</p>
            </div>
            <button
              type="button"
              onClick={() => loadTransportData()}
              className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white transition hover:bg-[#003b7a]"
            >
              Refresh List
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
            <select
              className="input"
              value={selectedRouteId}
              onChange={(event) => filterByRoute(event.target.value)}
            >
              <option value="">All routes</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>{route.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => checkAvailability(selectedRouteId)}
              className="rounded-xl bg-[#f4c430] px-5 py-3 font-bold text-[#002b5c] transition hover:bg-yellow-300"
            >
              Check Availability
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-extrabold text-[#002b5c]">Current Status</h2>
          {availability ? (
            <div className="mt-4 space-y-3">
              <span className={availability.available ? "rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700" : "rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700"}>
                {availability.available ? "AVAILABLE" : "NOT AVAILABLE"}
              </span>
              <p className="font-bold text-[#002b5c]">{availability.routeName}</p>
              <p className="text-sm text-slate-600">{availability.message}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Select a route to view availability.</p>
          )}
        </div>
      </section>

      {canManage && (
        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <form onSubmit={createRoute} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
            <h2 className="text-xl font-extrabold text-[#002b5c] md:col-span-2">Create Route</h2>
            <input className="input" placeholder="Route name" value={routeForm.name} onChange={(e) => setRouteForm((c) => ({ ...c, name: e.target.value }))} required />
            <select className="input" value={routeForm.status} onChange={(e) => setRouteForm((c) => ({ ...c, status: e.target.value as RouteStatus }))}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
            <input className="input" placeholder="Origin" value={routeForm.origin} onChange={(e) => setRouteForm((c) => ({ ...c, origin: e.target.value }))} required />
            <input className="input" placeholder="Destination" value={routeForm.destination} onChange={(e) => setRouteForm((c) => ({ ...c, destination: e.target.value }))} required />
            <input className="input md:col-span-2" placeholder="Description" value={routeForm.description} onChange={(e) => setRouteForm((c) => ({ ...c, description: e.target.value }))} />
            <button className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white md:col-span-2">Create Route</button>
          </form>

          <form onSubmit={createStop} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
            <h2 className="text-xl font-extrabold text-[#002b5c] md:col-span-2">Create Stop</h2>
            <input className="input" placeholder="Stop name" value={stopForm.name} onChange={(e) => setStopForm((c) => ({ ...c, name: e.target.value }))} required />
            <input className="input" placeholder="Location" value={stopForm.location} onChange={(e) => setStopForm((c) => ({ ...c, location: e.target.value }))} required />
            <input className="input" placeholder="Latitude" value={stopForm.latitude} onChange={(e) => setStopForm((c) => ({ ...c, latitude: e.target.value }))} />
            <input className="input" placeholder="Longitude" value={stopForm.longitude} onChange={(e) => setStopForm((c) => ({ ...c, longitude: e.target.value }))} />
            <select className="input md:col-span-2" value={stopForm.routeId} onChange={(e) => setStopForm((c) => ({ ...c, routeId: e.target.value }))}>
              <option value="">Without route</option>
              {routes.map((route) => <option key={route.id} value={route.id}>{route.name}</option>)}
            </select>
            <button className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white md:col-span-2">Create Stop</button>
          </form>

          <form onSubmit={createVehicle} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
            <h2 className="text-xl font-extrabold text-[#002b5c] md:col-span-2">Create Vehicle</h2>
            <input className="input" placeholder="Code" value={vehicleForm.code} onChange={(e) => setVehicleForm((c) => ({ ...c, code: e.target.value }))} required />
            <input className="input" placeholder="Plate" value={vehicleForm.plate} onChange={(e) => setVehicleForm((c) => ({ ...c, plate: e.target.value }))} required />
            <input className="input" type="number" min="1" placeholder="Capacity" value={vehicleForm.capacity} onChange={(e) => setVehicleForm((c) => ({ ...c, capacity: e.target.value }))} required />
            <select className="input" value={vehicleForm.status} onChange={(e) => setVehicleForm((c) => ({ ...c, status: e.target.value as VehicleStatus }))}>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="IN_SERVICE">IN_SERVICE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
            </select>
            <select className="input md:col-span-2" value={vehicleForm.currentRouteId} onChange={(e) => setVehicleForm((c) => ({ ...c, currentRouteId: e.target.value }))}>
              <option value="">No assigned route</option>
              {routes.map((route) => <option key={route.id} value={route.id}>{route.name}</option>)}
            </select>
            <button className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white md:col-span-2">Create Vehicle</button>
          </form>

          <form onSubmit={createSchedule} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
            <h2 className="text-xl font-extrabold text-[#002b5c] md:col-span-2">Create Schedule</h2>
            <select className="input" value={scheduleForm.routeId} onChange={(e) => setScheduleForm((c) => ({ ...c, routeId: e.target.value }))} required>
              <option value="">Select route</option>
              {routes.map((route) => <option key={route.id} value={route.id}>{route.name}</option>)}
            </select>
            <select className="input" value={scheduleForm.vehicleId} onChange={(e) => setScheduleForm((c) => ({ ...c, vehicleId: e.target.value }))}>
              <option value="">No vehicle</option>
              {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.code}</option>)}
            </select>
            <input className="input" type="datetime-local" value={scheduleForm.departureTime} onChange={(e) => setScheduleForm((c) => ({ ...c, departureTime: e.target.value }))} required />
            <input className="input" type="datetime-local" value={scheduleForm.arrivalTime} onChange={(e) => setScheduleForm((c) => ({ ...c, arrivalTime: e.target.value }))} required />
            <select className="input md:col-span-2" value={scheduleForm.status} onChange={(e) => setScheduleForm((c) => ({ ...c, status: e.target.value as ScheduleStatus }))}>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="DELAYED">DELAYED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
            <button className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white md:col-span-2">Create Schedule</button>
          </form>
        </section>
      )}

      <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-xl font-extrabold text-[#002b5c]">Routes</h2>
          <p className="text-sm text-slate-500">Campus transport routes and operational status.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-[#002b5c] text-white">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Origin</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading transport routes...</td></tr>}
              {!loading && routes.map((route) => (
                <tr key={route.id} className="border-b border-slate-100">
                  <td className="p-4 font-bold text-[#002b5c]">{route.name}</td>
                  <td className="p-4 text-slate-600">{route.origin}</td>
                  <td className="p-4 text-slate-600">{route.destination}</td>
                  <td className="p-4"><span className={routeBadgeClass(route.status)}>{route.status}</span></td>
                  <td className="p-4">
                    <button type="button" onClick={() => checkAvailability(route.id)} className="rounded-xl bg-[#f4c430] px-4 py-2 font-bold text-[#002b5c]">Availability</button>
                  </td>
                </tr>
              ))}
              {!loading && routes.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">No transport routes found.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <h2 className="border-b border-slate-100 p-5 text-xl font-extrabold text-[#002b5c]">Stops</h2>
          <div className="max-h-96 overflow-y-auto">
            {stops.map((stop) => <div key={stop.id} className="border-b border-slate-100 p-5"><p className="font-bold text-[#002b5c]">{stop.name}</p><p className="text-sm text-slate-600">{stop.location}</p></div>)}
            {stops.length === 0 && <p className="p-5 text-sm text-slate-500">No stops found.</p>}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <h2 className="border-b border-slate-100 p-5 text-xl font-extrabold text-[#002b5c]">Vehicles</h2>
          <div className="max-h-96 overflow-y-auto">
            {vehicles.map((vehicle) => <div key={vehicle.id} className="border-b border-slate-100 p-5"><p className="font-bold text-[#002b5c]">{vehicle.code} - {vehicle.plate}</p><p className="text-sm text-slate-600">Capacity: {vehicle.capacity}</p><span className={vehicleBadgeClass(vehicle.status)}>{vehicle.status}</span></div>)}
            {vehicles.length === 0 && <p className="p-5 text-sm text-slate-500">No vehicles found.</p>}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <h2 className="border-b border-slate-100 p-5 text-xl font-extrabold text-[#002b5c]">Schedules</h2>
          <div className="max-h-96 overflow-y-auto">
            {schedules.map((schedule) => <div key={schedule.id} className="border-b border-slate-100 p-5"><p className="font-bold text-[#002b5c]">{formatDate(schedule.departureTime)}</p><p className="text-sm text-slate-600">Arrival: {formatDate(schedule.arrivalTime)}</p><span className={scheduleBadgeClass(schedule.status)}>{schedule.status}</span></div>)}
            {schedules.length === 0 && <p className="p-5 text-sm text-slate-500">No schedules found.</p>}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
