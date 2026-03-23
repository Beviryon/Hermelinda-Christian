"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import {
  createAccessCode,
  listAccessCodes,
  setAccessCodeActiveState,
} from "@/lib/firestore";
import { AccessCodeDoc } from "@/lib/types";

function randomCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let output = "";
  for (let i = 0; i < length; i += 1) {
    output += chars[Math.floor(Math.random() * chars.length)];
  }
  return output;
}

export default function AdminPage() {
  const [codes, setCodes] = useState<AccessCodeDoc[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState(randomCode());
  const [isAdminCode, setIsAdminCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const items = await listAccessCodes();
      setCodes(items);
    } catch {
      setError("Impossible de charger les codes.");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createAccessCode(code, name, isAdminCode);
      setName("");
      setCode(randomCode());
      setIsAdminCode(false);
      await refresh();
    } catch {
      setError("Creation impossible. Le code existe peut-etre deja.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleCode(item: AccessCodeDoc) {
    setError(null);
    try {
      await setAccessCodeActiveState(item.code, !item.isActive);
      await refresh();
    } catch {
      setError("Mise a jour impossible.");
    }
  }

  return (
    <PageShell>
      <section className="mb-8">
        <h1 className="text-3xl font-semibold">Administration</h1>
        <p className="mt-2 text-foreground/75">
          Gerer les codes d&apos;acces prives des invites.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={handleCreate} className="glass-card rounded-2xl p-5">
          <h2 className="text-lg font-medium">Creer un code</h2>
          <label className="mb-1 mt-4 block text-sm">Nom invite</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:border-primary"
            placeholder="Invite"
          />

          <label className="mb-1 mt-4 block text-sm">Code</label>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:border-primary"
              required
            />
            <button
              type="button"
              onClick={() => setCode(randomCode())}
              className="rounded-xl border border-border bg-white px-3 text-sm hover:bg-muted"
            >
              Nouveau
            </button>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-foreground/80">
            <input
              type="checkbox"
              checked={isAdminCode}
              onChange={(e) => setIsAdminCode(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            Donner l&apos;acces admin a ce code
          </label>

          {error ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-95 disabled:opacity-70"
          >
            {loading ? "Creation..." : "Creer le code"}
          </button>
        </form>

        <section className="space-y-3">
          {codes.map((item) => (
            <article
              key={item.code}
              className="glass-card flex items-center justify-between gap-4 rounded-2xl p-4"
            >
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-xs text-foreground/65">Code: {item.code}</p>
                <p className="text-xs text-foreground/65">
                  Role: {item.isAdmin ? "Admin" : "Invite"}
                </p>
                <p className="text-xs text-foreground/65">
                  Session: {item.sessionId ? "Active" : "Aucune"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleCode(item)}
                className={`rounded-xl px-3 py-2 text-sm ${
                  item.isActive
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                {item.isActive ? "Desactiver" : "Activer"}
              </button>
            </article>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
