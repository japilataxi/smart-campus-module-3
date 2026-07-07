"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof RegisterForm | "general", string>>;

const initialForm: RegisterForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordChecks = useMemo(
    () => ({
      length: form.password.length >= 8,
      uppercase: /[A-Z]/.test(form.password),
      lowercase: /[a-z]/.test(form.password),
      number: /[0-9]/.test(form.password),
    }),
    [form.password]
  );

  function updateField(field: keyof RegisterForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));

    setErrors((current) => ({
      ...current,
      [field]: "",
      general: "",
    }));
  }

  function validateForm() {
    const newErrors: FormErrors = {};

    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const emailRegex = /^[^\s@]+@uce\.edu\.ec$/;

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    } else if (!nameRegex.test(form.firstName.trim())) {
      newErrors.firstName = "First name must contain only letters.";
    } else if (form.firstName.trim().length < 2) {
      newErrors.firstName = "First name must have at least 2 characters.";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    } else if (!nameRegex.test(form.lastName.trim())) {
      newErrors.lastName = "Last name must contain only letters.";
    } else if (form.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must have at least 2 characters.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Institutional email is required.";
    } else if (!emailRegex.test(form.email.trim().toLowerCase())) {
      newErrors.email = "Use a valid institutional email ending in @uce.edu.ec.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (
      !passwordChecks.length ||
      !passwordChecks.uppercase ||
      !passwordChecks.lowercase ||
      !passwordChecks.number
    ) {
      newErrors.password =
        "Password must have at least 8 characters, uppercase, lowercase and a number.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
    } catch {
      setErrors({
        general:
          "We could not create your account. Please verify your information or try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#eef3f8] lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#002b5c] text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002b5c] via-[#003b7a] to-[#8b0000]" />
        <div className="absolute -right-28 top-0 h-full w-72 rotate-6 bg-[#f4c430]" />

        <div className="relative z-10 px-12 pt-8">
          <div className="flex items-center gap-5">
            <div className="rounded-full bg-white p-3 shadow-xl">
              <Image
                src="/uce-logo.png"
                alt="Universidad Central del Ecuador"
                width={72}
                height={72}
                priority
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold">Smart Campus</h1>
              <p className="text-lg font-medium text-[#f4c430]">
                Universidad Central del Ecuador
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 px-12 pb-12">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
            Create account
          </p>

          <h2 className="max-w-xl text-5xl font-extrabold leading-tight">
            Join your Smart Campus platform.
          </h2>

          <div className="mt-7 h-1 w-40 rounded-full bg-[#f4c430]" />

          <p className="mt-7 max-w-xl text-lg leading-8 text-white/85">
            Register with your institutional account to access academic
            services, notifications, incidents, QR access, transport and campus
            resources.
          </p>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-5">
            <Feature
              icon={<ShieldCheck />}
              title="Secure"
              text="Institutional access"
            />
            <Feature
              icon={<CheckCircle2 />}
              title="Validated"
              text="Clear user data"
            />
            <Feature
              icon={<User />}
              title="Profile"
              text="Student account"
            />
          </div>
        </div>
      </section>
      <section className="flex min-h-screen items-center justify-center px-6 py-10 lg:px-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-200 md:p-10"
          noValidate
        >
          <div className="mb-6 flex justify-center lg:hidden">
            <Image
              src="/uce-logo.png"
              alt="Universidad Central del Ecuador"
              width={86}
              height={86}
              priority
            />
          </div>

          <h1 className="text-center text-4xl font-extrabold text-[#002b5c] md:text-5xl">
            Create Account
          </h1>

          <p className="mt-4 text-center text-base text-slate-500 md:text-lg">
            Use your institutional email to register.
          </p>

          {errors.general && (
            <Alert message={errors.general} />
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Input
              icon={<User size={20} />}
              placeholder="First Name"
              value={form.firstName}
              onChange={(value) => updateField("firstName", value)}
              error={errors.firstName}
            />

            <Input
              icon={<User size={20} />}
              placeholder="Last Name"
              value={form.lastName}
              onChange={(value) => updateField("lastName", value)}
              error={errors.lastName}
            />

            <Input
              icon={<Mail size={20} />}
              placeholder="student@uce.edu.ec"
              type="email"
              value={form.email}
              onChange={(value) => updateField("email", value)}
              error={errors.email}
              className="md:col-span-2"
            />

            <PasswordInput
              icon={<Lock size={20} />}
              placeholder="Password"
              value={form.password}
              onChange={(value) => updateField("password", value)}
              error={errors.password}
              visible={showPassword}
              onToggleVisible={() => setShowPassword((current) => !current)}
              className="md:col-span-2"
            />

            <PasswordInput
              icon={<Lock size={20} />}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(value) => updateField("confirmPassword", value)}
              error={errors.confirmPassword}
              visible={showConfirmPassword}
              onToggleVisible={() =>
                setShowConfirmPassword((current) => !current)
              }
              className="md:col-span-2"
            />
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-sm font-bold text-[#002b5c]">
              Password requirements
            </p>

            <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <PasswordRule valid={passwordChecks.length} text="8 characters" />
              <PasswordRule valid={passwordChecks.uppercase} text="1 uppercase" />
              <PasswordRule valid={passwordChecks.lowercase} text="1 lowercase" />
              <PasswordRule valid={passwordChecks.number} text="1 number" />
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="mt-8 w-full rounded-xl bg-[#002b5c] px-5 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#003b7a] disabled:cursor-not-allowed disabled:opacity-70 md:py-5 md:text-lg"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-bold text-[#8b0000]" href="/login">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

function Input({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  error,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  className?: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <div
        className={`flex items-center gap-4 rounded-xl border px-5 py-4 transition focus-within:border-[#f4c430] ${
          error ? "border-red-300 bg-red-50/40" : "border-slate-300 bg-white"
        }`}
      >
        <span className={error ? "text-red-400" : "text-slate-400"}>
          {icon}
        </span>

        <input
          className="w-full bg-transparent outline-none placeholder:text-slate-400"
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {error && <FieldError message={error} />}
    </div>
  );
}

function PasswordInput({
  icon,
  value,
  onChange,
  placeholder,
  className = "",
  error,
  visible,
  onToggleVisible,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  error?: string;
  visible: boolean;
  onToggleVisible: () => void;
}) {
  return (
    <div className={className}>
      <div
        className={`flex items-center gap-4 rounded-xl border px-5 py-4 transition focus-within:border-[#f4c430] ${
          error ? "border-red-300 bg-red-50/40" : "border-slate-300 bg-white"
        }`}
      >
        <span className={error ? "text-red-400" : "text-slate-400"}>
          {icon}
        </span>

        <input
          className="w-full bg-transparent outline-none placeholder:text-slate-400"
          placeholder={placeholder}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          type="button"
          onClick={onToggleVisible}
          className="text-slate-400 transition hover:text-[#002b5c]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && <FieldError message={error} />}
    </div>
  );
}

function PasswordRule({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-2 ${
        valid ? "text-green-700" : "text-slate-500"
      }`}
    >
      <CheckCircle2 size={16} />
      <span>{text}</span>
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-red-600">
      <AlertCircle size={15} />
      {message}
    </p>
  );
}

function Alert({ message }: { message: string }) {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur transition hover:bg-white/20">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-[#f4c430]">
        {icon}
      </div>

      <p className="font-bold">{title}</p>
      <p className="text-sm text-white/70">{text}</p>
    </div>
  );
}      