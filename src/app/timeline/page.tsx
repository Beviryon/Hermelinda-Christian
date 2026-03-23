"use client";

import { motion } from "framer-motion";
import { PageShell } from "@/components/page-shell";

const steps = [
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

export default function TimelinePage() {
  return (
    <PageShell>
      <section className="mb-8">
        <h1 className="text-3xl font-semibold">Programme du mariage</h1>
        <p className="mt-2 text-foreground/75">
          Une journee pensee pour partager la joie avec vous.
        </p>
      </section>

      <div className="relative ml-4 border-l-2 border-primary/40 pl-6 sm:ml-6 sm:pl-8">
        {steps.map((step, idx) => (
          <motion.article
            key={step.time}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="relative mb-8 rounded-2xl border border-border bg-card p-5"
          >
            <span className="absolute -left-[2.2rem] top-6 h-3 w-3 rounded-full bg-primary sm:-left-[2.65rem]" />
            <p className="text-xs uppercase tracking-[0.2em] text-primary/80">
              {step.time}
            </p>
            <h2 className="mt-1 text-xl font-medium">{step.title}</h2>
            <p className="mt-1 text-foreground/70">{step.place}</p>
            <p className="mt-2 text-sm text-foreground/60">{step.address}</p>
          </motion.article>
        ))}
      </div>
    </PageShell>
  );
}
