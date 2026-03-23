"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { addGuestMessage, listGuestMessages } from "@/lib/firestore";
import { GuestMessage } from "@/lib/types";

export default function GuestbookPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const items = await listGuestMessages();
      setMessages(items);
    } catch {
      setError("Impossible de charger les messages.");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !message.trim()) {
      setError("Veuillez renseigner votre nom et un message.");
      return;
    }

    setSaving(true);
    try {
      await addGuestMessage(name, message);
      setMessage("");
      await refresh();
    } catch {
      setError("Envoi impossible. Verifiez Firebase.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell>
      <section className="mb-8">
        <h1 className="text-3xl font-semibold">Livre d&apos;or</h1>
        <p className="mt-2 text-foreground/75">
          Laissez un mot pour les maries.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5">
          <label className="mb-1 block text-sm font-medium">Nom</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:border-primary"
            placeholder="Votre nom"
            required
          />

          <label className="mb-1 block text-sm font-medium">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-32 w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:border-primary"
            placeholder="Felicitation, amour, souvenirs..."
            required
          />

          {error ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-95 disabled:opacity-70"
          >
            {saving ? "Envoi..." : "Publier"}
          </button>
        </form>

        <section className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-foreground/70">Aucun message pour le moment.</p>
          ) : null}
          {messages.map((item) => (
            <article key={item.id} className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-medium">{item.name}</h2>
                <p className="text-xs text-foreground/60">
                  {item.createdAt
                    ? item.createdAt.toLocaleString("fr-FR")
                    : "A l'instant"}
                </p>
              </div>
              <p className="mt-2 text-foreground/80">{item.message}</p>
            </article>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
