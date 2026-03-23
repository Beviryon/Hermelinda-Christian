"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { DEMO_LOGIN_CODE, isDemoMode } from "@/lib/demo-mode";

export default function MarieLoginPage() {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { loginAsAdmin, error } = useAuth();
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const success = await loginAsAdmin(code);
    setSubmitting(false);
    if (success) router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff4ea] via-[#fffaf4] to-[#fff2e6] px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card w-full max-w-md rounded-3xl p-7 sm:p-9"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-primary/80">
            Espace maries
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">
            Connexion admin
          </h1>
          <p className="mt-3 text-sm text-foreground/70">
            Cette page est reservee aux maries pour gerer les codes invites.
          </p>

          {isDemoMode ? (
            <p className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">
              Mode demo: utilisez <strong>{DEMO_LOGIN_CODE}</strong>
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label htmlFor="admin-code" className="block text-sm font-medium">
              Code admin
            </label>
            <input
              id="admin-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="MARIAGE26"
              autoComplete="off"
              required
              className="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
              {submitting ? "Connexion..." : "Acceder a l'administration"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-foreground/65">
            Invite ?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Retour a la connexion classique
            </Link>
          </p>
        </motion.section>
      </div>
    </div>
  );
}
