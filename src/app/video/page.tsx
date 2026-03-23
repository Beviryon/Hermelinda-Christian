"use client";

import { PageShell } from "@/components/page-shell";

const videoUrl = "https://samplelib.com/lib/preview/mp4/sample-5s.mp4";

export default function VideoPage() {
  return (
    <PageShell>
      <section className="mb-8">
        <h1 className="text-3xl font-semibold">Video du mariage</h1>
        <p className="mt-2 text-foreground/75">
          Revivez les instants forts en un clic.
        </p>
      </section>

      <div className="overflow-hidden rounded-3xl border border-border bg-card p-4 sm:p-6">
        <video
          controls
          className="w-full rounded-2xl bg-black"
          preload="metadata"
          src={videoUrl}
        />
      </div>
    </PageShell>
  );
}
