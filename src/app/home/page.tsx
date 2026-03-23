"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/components/auth-provider";

const ceremonyProgram = [
  {
    time: "13:30",
    title: "Mairie",
    place: "Mairie de Lognes",
    address: "Allee Walesa, 77186 Lognes",
  },
  {
    time: "14:30",
    title: "Photos",
    place: "Session souvenirs",
    address: "Lieu communique le jour J",
  },
  {
    time: "16:30",
    title: "Benediction nuptiale",
    place: "Ceremonie",
    address: "Lieu communique aux invites",
  },
  {
    time: "18:00",
    title: "Vin d'honneur",
    place: "Serris",
    address: "2 Place Antoine Mauny, 77700 Serris",
  },
  {
    time: "20:00",
    title: "Soiree",
    place: "Reception",
    address: "Lieu communique aux invites",
  },
  {
    time: "05:00",
    title: "Fin",
    place: "Cloture",
    address: "Fin de celebration",
  },
];

export default function HomePage() {
  const { status, session } = useAuth();
  const isAuthenticated = status === "authenticated";

  return (
    <PageShell>
      <section className="relative min-h-[76vh] overflow-hidden rounded-3xl border border-border">
        <Image
          src="/images/hero-couple.png"
          alt="Hermelinda et Christian"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(204,85,0,0.28),transparent_50%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 p-8 text-white sm:p-12 lg:p-16"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/85">
            {isAuthenticated
              ? `Bienvenue ${session?.name ?? "Invite"}`
              : "Experience immersive privee"}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            Hermelinda & Christian
          </h1>
          <p className="mt-4 text-lg text-white/85">04 Avril 2026</p>
          <p className="mt-6 max-w-2xl text-white/90">
            Revivez chaque instant de notre union a travers notre histoire, nos
            emotions, nos souvenirs, et tous les visages que nous aimons.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {isAuthenticated ? (
              <Link
                href="/story"
                className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-95"
              >
                Entrer dans notre histoire
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-95"
                >
                  Debloquer avec mon code
                </Link>
                <Link
                  href="/marie"
                  className="rounded-xl border border-white/40 bg-white/15 px-5 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/25"
                >
                  Espace maries
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      <section id="programme" className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary/80">
              Ceremony flow
            </p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Programme de la ceremonie
            </h2>
          </div>
          {!isAuthenticated ? (
            <p className="text-xs text-foreground/60">
              Les autres sections sont accessibles avec votre code.
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ceremonyProgram.map((step, idx) => (
            <motion.article
              key={step.time}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-white to-orange-50 p-4 shadow-[0_8px_26px_rgba(204,85,0,0.09)]"
            >
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-primary/10 blur-xl" />
              <p className="text-xs uppercase tracking-[0.2em] text-primary">
                {step.time}
              </p>
              <h3 className="mt-2 text-lg font-medium">{step.title}</h3>
              <p className="mt-1 text-sm text-foreground/75">{step.place}</p>
              <p className="mt-2 text-xs text-foreground/60">{step.address}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
