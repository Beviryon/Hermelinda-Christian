"use client";

import { motion } from "framer-motion";
import { PageShell } from "@/components/page-shell";

const storyMoments = [
  {
    period: "Le debut",
    title: "Une rencontre inattendue",
    text: "Tout a commence par une conversation simple, sincere, qui est vite devenue une evidence. Deux univers, deux chemins, une meme direction.",
  },
  {
    period: "Les premiers souvenirs",
    title: "Construire des moments",
    text: "Des sorties improvisees, des messages tard le soir, des eclats de rire partages et cette certitude de pouvoir toujours compter l'un sur l'autre.",
  },
  {
    period: "L'epreuve et la foi",
    title: "Grandir ensemble",
    text: "Chaque saison a apporte ses defis, mais aussi davantage de patience, d'ecoute et de confiance. Leur amour s'est enracine dans la foi et le respect.",
  },
  {
    period: "La decision",
    title: "Choisir le pour toujours",
    text: "Au fil des annees, la question ne fut plus 'si', mais 'quand'. Le mariage est devenu la suite naturelle d'une promesse deja vecue au quotidien.",
  },
  {
    period: "Aujourd'hui",
    title: "Un nouveau chapitre",
    text: "Leur histoire continue, entouree de ceux qu'ils aiment. Ce jour de celebration est le debut d'une aventure encore plus belle, ecrite a deux.",
  },
];

const sharedMoments = [
  "Voyages et promenades au coucher du soleil",
  "Prier ensemble et se soutenir dans les moments cles",
  "Reves de famille, projets communs et objectifs partages",
  "Joies simples du quotidien, transformees en souvenirs precieux",
];

function VectorHeart() {
  return (
    <svg
      viewBox="0 0 300 280"
      className="h-20 w-20 text-primary/35"
      fill="none"
      aria-hidden
    >
      <path
        d="M150 257C149 257 148 257 147 256C58 193 0 143 0 85C0 38 36 0 83 0C112 0 136 14 150 35C164 14 188 0 217 0C264 0 300 38 300 85C300 143 242 193 153 256C152 257 151 257 150 257Z"
        fill="currentColor"
      />
    </svg>
  );
}

function VectorRing() {
  return (
    <svg
      viewBox="0 0 220 120"
      className="h-16 w-32 text-primary/35"
      fill="none"
      aria-hidden
    >
      <circle cx="72" cy="60" r="42" stroke="currentColor" strokeWidth="8" />
      <circle cx="148" cy="60" r="42" stroke="currentColor" strokeWidth="8" />
    </svg>
  );
}

export default function StoryPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-[#fff7f0] via-[#fffaf4] to-[#fff1e6] p-6 sm:p-10">
        <div className="absolute -top-10 -right-8 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-14 -left-8 h-44 w-44 rounded-full bg-orange-200/25 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative z-10"
        >
          <p className="text-xs uppercase tracking-[0.23em] text-primary/85">
            Notre histoire
          </p>
          <h1 className="mt-3 max-w-3xl text-2xl font-semibold leading-tight sm:text-5xl">
            De la rencontre a la promesse du mariage
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-foreground/80 sm:text-base">
            Une page pensee comme un recit vivant: des souvenirs, des etapes,
            des emotions. Prenez le temps de faire defiler, comme on tourne les
            pages d&apos;un carnet de vie.
          </p>

          <div className="mt-5 flex items-center gap-3 sm:mt-6 sm:gap-4">
            <VectorHeart />
            <VectorRing />
          </div>
        </motion.div>
      </section>

      <section className="relative mt-10">
        <div className="pointer-events-none absolute left-4 top-0 h-full w-px bg-primary/30 sm:left-1/2 sm:-translate-x-1/2" />
        <div className="space-y-6 pl-3 sm:pl-0">
          {storyMoments.map((moment, idx) => {
            const isRight = idx % 2 === 1;
            return (
              <motion.article
                key={moment.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: idx * 0.04 }}
                className={`relative rounded-2xl border border-border bg-white/90 p-4 shadow-[0_10px_26px_rgba(204,85,0,0.08)] sm:w-[calc(50%-1rem)] sm:p-5 ${
                  isRight ? "sm:ml-auto" : ""
                }`}
              >
                <span
                  className={`absolute top-7 h-3 w-3 rounded-full bg-primary ${
                    isRight
                      ? "-left-[0.8rem] sm:left-auto sm:right-[-0.45rem]"
                      : "-left-[0.8rem] sm:left-[-0.45rem]"
                  }`}
                />
                <p className="text-xs uppercase tracking-[0.2em] text-primary/80">
                  {moment.period}
                </p>
                <h2 className="mt-2 text-lg font-medium sm:text-xl">{moment.title}</h2>
                <p className="mt-2 text-sm text-foreground/75 sm:text-base">
                  {moment.text}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-4 rounded-3xl border border-border bg-white/80 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary/80">
            Moments partages
          </p>
          <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
            Les souvenirs qui les ont rapproches
          </h3>
        </div>
        <ul className="space-y-2">
          {sharedMoments.map((line) => (
            <motion.li
              key={line}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35 }}
              className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm"
            >
              {line}
            </motion.li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
