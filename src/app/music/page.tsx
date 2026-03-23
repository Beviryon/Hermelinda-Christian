"use client";

import { useState } from "react";
import { PageShell } from "@/components/page-shell";

const tracks = [
  {
    id: "t1",
    title: "Entree des maries",
    artist: "Playlist Mariage",
    url: "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
  },
  {
    id: "t2",
    title: "Premiere danse",
    artist: "Playlist Mariage",
    url: "https://samplelib.com/lib/preview/mp3/sample-6s.mp3",
  },
];

export default function MusicPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = tracks[currentIndex];

  return (
    <PageShell>
      <section className="mb-8">
        <h1 className="text-3xl font-semibold">Musique</h1>
        <p className="mt-2 text-foreground/75">
          Une ambiance douce pour revivre l&apos;instant.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="glass-card rounded-2xl p-4">
          <p className="mb-3 text-sm text-foreground/70">Playlist</p>
          <div className="space-y-2">
            {tracks.map((track, idx) => (
              <button
                key={track.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                  idx === currentIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-primary/15"
                }`}
              >
                <p className="font-medium">{track.title}</p>
                <p className="text-xs opacity-80">{track.artist}</p>
              </button>
            ))}
          </div>
        </aside>

        <section className="glass-card rounded-2xl p-6">
          <h2 className="text-2xl font-medium">{current.title}</h2>
          <p className="mt-1 text-foreground/70">{current.artist}</p>
          <audio key={current.id} controls className="mt-6 w-full">
            <source src={current.url} type="audio/mpeg" />
            Votre navigateur ne supporte pas l&apos;audio.
          </audio>
        </section>
      </div>
    </PageShell>
  );
}
