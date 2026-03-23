"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { DEMO_LOGIN_CODE, isDemoMode } from "@/lib/demo-mode";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { loginWithCode, error } = useAuth();
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const success = await loginWithCode(code);
    setSubmitting(false);
    if (success) router.push("/home");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="glass-card w-full max-w-md rounded-3xl p-8 sm:p-10"
      >
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-primary/80">
          Espace prive
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Hermelinda & Christian
        </h1>
        <p className="mt-3 text-sm text-foreground/70">
          Entrez votre code d&apos;invitation pour acceder a l&apos;experience.
        </p>
        {isDemoMode ? (
          <p className="mt-3 rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">
            Mode demo actif - code de test: <strong>{DEMO_LOGIN_CODE}</strong>
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label htmlFor="code" className="block text-sm font-medium">
            Code d&apos;acces
          </label>
          <input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
            placeholder="ABC123"
            autoComplete="off"
            required
          />
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Connexion..." : "Connexion"}
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-foreground/65">
          Vous etes les maries ?{" "}
          <Link href="/marie" className="font-medium text-primary hover:underline">
            Acceder a l&apos;espace maries
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
