"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type CountdownData = Countdown & {
  isCelebrationStarted: boolean;
};

const weddingDate = new Date("2026-04-04T13:30:00");
const celebrationTrackUrl = "https://samplelib.com/lib/preview/mp3/sample-12s.mp3";
const fireworkSpots = [
  { left: "10%", top: "12%", color: "#ffd166", delay: 0.1 },
  { left: "78%", top: "18%", color: "#ff8fab", delay: 0.45 },
  { left: "18%", top: "66%", color: "#fff6d6", delay: 0.85 },
  { left: "84%", top: "70%", color: "#cc5500", delay: 1.15 },
];

function getCountdownValue(): CountdownData {
  const now = new Date().getTime();
  const rawDistance = weddingDate.getTime() - now;
  const distance = Math.max(0, rawDistance);

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isCelebrationStarted: rawDistance <= 0,
  };
}

export default function HomePage() {
  const { status, session } = useAuth();
  const isAuthenticated = status === "authenticated";
  const [countdown, setCountdown] = useState<CountdownData>(getCountdownValue());
  const [isCelebrationMusicOn, setIsCelebrationMusicOn] = useState(false);
  const celebrationAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownValue());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const audio = new Audio(celebrationTrackUrl);
    audio.loop = true;
    audio.volume = 0.35;
    celebrationAudioRef.current = audio;

    return () => {
      audio.pause();
      celebrationAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = celebrationAudioRef.current;
    if (!audio) return;

    if (countdown.isCelebrationStarted && isCelebrationMusicOn) {
      void audio.play().catch(() => {
        setIsCelebrationMusicOn(false);
      });
      return;
    }

    audio.pause();
    audio.currentTime = 0;
  }, [countdown.isCelebrationStarted, isCelebrationMusicOn]);

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
              <Link
                href="/login"
                className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-95"
              >
                Debloquer avec mon code
              </Link>
            )}
          </div>

          {!countdown.isCelebrationStarted ? (
            <div className="mt-6 max-w-2xl rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-md sm:p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/85">
                Countdown to forever
              </p>
              <p className="mt-2 text-sm text-white/85">
                Plus que quelques instants avant notre grand oui.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                {[
                  { label: "Jours", value: countdown.days },
                  { label: "Heures", value: countdown.hours },
                  { label: "Minutes", value: countdown.minutes },
                  { label: "Secondes", value: countdown.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/20 bg-black/20 px-2 py-3 text-center shadow-[0_0_22px_rgba(255,255,255,0.12)] sm:px-3"
                  >
                    <p className="text-xl font-semibold text-white sm:text-2xl">
                      {String(item.value).padStart(2, "0")}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="wedding-celebration mt-6 max-w-2xl overflow-hidden rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur-md sm:p-6">
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                {fireworkSpots.map((spot) => (
                  <motion.svg
                    key={`firework-${spot.left}-${spot.top}`}
                    viewBox="0 0 100 100"
                    className="absolute h-16 w-16 sm:h-20 sm:w-20"
                    style={{ left: spot.left, top: spot.top, color: spot.color }}
                    initial={{ opacity: 0, scale: 0.2, rotate: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.2, 1.1, 1.2], rotate: 30 }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      repeatDelay: 0.35,
                      delay: spot.delay,
                    }}
                  >
                    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <line x1="50" y1="50" x2="50" y2="8" />
                      <line x1="50" y1="50" x2="50" y2="92" />
                      <line x1="50" y1="50" x2="8" y2="50" />
                      <line x1="50" y1="50" x2="92" y2="50" />
                      <line x1="50" y1="50" x2="18" y2="18" />
                      <line x1="50" y1="50" x2="82" y2="82" />
                      <line x1="50" y1="50" x2="18" y2="82" />
                      <line x1="50" y1="50" x2="82" y2="18" />
                    </g>
                    <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.4" />
                  </motion.svg>
                ))}
              </div>
              <div className="confetti-layer" aria-hidden>
                {[...Array(18)].map((_, idx) => (
                  <span
                    key={`confetti-${idx}`}
                    className={`confetti-piece confetti-color-${(idx % 4) + 1}`}
                    style={{
                      left: `${(idx / 18) * 100}%`,
                      animationDelay: `${(idx % 6) * 0.25}s`,
                    }}
                  />
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 text-center text-2xl font-semibold text-white sm:text-4xl"
              >
                Heureux mariage
              </motion.p>
              <p className="relative z-10 mt-2 text-center text-sm text-white/85">
                Que votre amour grandisse chaque jour.
              </p>
              <div className="relative z-10 mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsCelebrationMusicOn((value) => !value)}
                  className="rounded-full border border-white/40 bg-white/15 px-4 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-white/25"
                >
                  {isCelebrationMusicOn ? "Couper la musique" : "Lancer la musique"}
                </button>
              </div>
            </div>
          )}
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
