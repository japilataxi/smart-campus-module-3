import {
  Bell,
  BookOpen,
  Cloud,
  Database,
  GitBranch,
  Layers,
  Monitor,
  Radio,
  Server,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export default function SystemInfoPage() {
  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Smart Campus Module 3
        </p>

        <h1 className="mt-4 text-5xl font-extrabold">
          Distributed Smart Campus Platform
        </h1>

        <p className="mt-4 max-w-4xl text-lg text-white/80">
          This section provides technical information about the Smart Campus platform, 
          including architecture, communication technologies, infrastructure and deployed services.
        </p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard icon={<Shield />} title="Auth Service">
          Handles user registration, login, JWT authentication, refresh tokens,
          roles and access control.
        </InfoCard>

        <InfoCard icon={<BookOpen />} title="Library Service">
          Manages books, authors, categories, loans and book availability.
        </InfoCard>

        <InfoCard icon={<Bell />} title="Notification Service">
          Consumes RabbitMQ events, stores notifications, updates Redis counters
          and emits real-time WebSocket notifications.
        </InfoCard>

        <InfoCard icon={<Radio />} title="Campus Incident Service">
          Manages campus incident reports and publishes incident events through
          RabbitMQ.
        </InfoCard>

        <InfoCard icon={<Server />} title="API Gateway">
          Central entry point that routes frontend requests to internal
          microservices.
        </InfoCard>

        <InfoCard icon={<Monitor />} title="Web App">
          Next.js interface for students, librarians and administrators.
        </InfoCard>

        <InfoCard icon={<Smartphone />} title="Mobile and Desktop">
          React Native mobile app and Electron desktop app prepared for
          multi-platform access.
        </InfoCard>

        <InfoCard icon={<Database />} title="Databases">
          Each business microservice uses its own PostgreSQL database to keep
          data ownership separated.
        </InfoCard>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-3xl font-extrabold text-[#002b5c]">
          Architecture Overview
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {[
            "Frontend Clients",
            "API Gateway",
            "Business Microservices",
            "Databases and Cache",
            "Event Driven Messaging",
          ].map((step, index) => (
            <div
              key={step}
              className="rounded-2xl bg-slate-50 p-5 text-center ring-1 ring-slate-200"
            >
              <p className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f4c430] font-extrabold text-[#002b5c]">
                {index + 1}
              </p>
              <p className="font-bold text-[#002b5c]">{step}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 leading-7 text-slate-600">
          The system follows a microservices architecture. The frontend does not
          communicate directly with business services. Instead, all requests go
          through the API Gateway. Each microservice owns its data and exposes
          REST endpoints. Asynchronous communication is handled through
          RabbitMQ, allowing services to react to events without tight coupling.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-extrabold text-[#002b5c]">
            Communication Patterns
          </h2>

          <ul className="mt-5 space-y-4 text-slate-600">
            <li>
              <strong>REST:</strong> Used for synchronous communication through
              the API Gateway.
            </li>
            <li>
              <strong>RabbitMQ:</strong> Used for asynchronous events such as
              user registration, library loans and campus incidents.
            </li>
            <li>
              <strong>WebSocket:</strong> Used by the notification-service to
              send real-time notifications to connected clients.
            </li>
            <li>
              <strong>Redis:</strong> Used for cache and unread notification
              counters.
            </li>
          </ul>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-extrabold text-[#002b5c]">
            DevOps and Deployment
          </h2>

          <ul className="mt-5 space-y-4 text-slate-600">
            <li>
              <strong>Docker:</strong> Each service has its own Dockerfile and
              can run as an isolated container.
            </li>
            <li>
              <strong>Docker Compose:</strong> Used to run the complete QA
              environment locally.
            </li>
            <li>
              <strong>GitHub Actions:</strong> Provides CI/CD pipelines for
              build, test and deployment workflows.
            </li>
            <li>
              <strong>Terraform:</strong> Defines QA and production
              infrastructure in AWS Academy.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-[#002b5c] p-8 text-white shadow-sm">
        <h2 className="text-3xl font-extrabold">
          Main Design Principles
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {[
            "SOLID",
            "DRY",
            "KISS",
            "YAGNI",
            "Low Coupling",
            "High Cohesion",
          ].map((principle) => (
            <div
              key={principle}
              className="rounded-2xl bg-white/10 p-4 text-center font-bold text-[#f4c430]"
            >
              {principle}
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-5 inline-flex rounded-2xl bg-[#f4c430]/20 p-4 text-[#002b5c]">
        {icon}
      </div>

      <h3 className="text-xl font-extrabold text-[#002b5c]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">{children}</p>
    </div>
  );
}