"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PageShell } from "@/components/page-shell";
import { listPhotos } from "@/lib/firestore";
import { PhotoItem } from "@/lib/types";

const fallbackPhotos: PhotoItem[] = [
  {
    id: "1",
    title: "Souvenir 1",
    imageUrl: "https://picsum.photos/id/1040/1200/800",
  },
  {
    id: "2",
    title: "Souvenir 2",
    imageUrl: "https://picsum.photos/id/1060/1200/800",
  },
  {
    id: "3",
    title: "Souvenir 3",
    imageUrl: "https://picsum.photos/id/1039/1200/800",
  },
  {
    id: "4",
    title: "Souvenir 4",
    imageUrl: "https://picsum.photos/id/1027/1200/800",
  },
];

export default function GalleryPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const items = await listPhotos();
        setPhotos(items.length > 0 ? items : fallbackPhotos);
      } catch {
        setPhotos(fallbackPhotos);
      }
    }
    void load();
  }, []);

  const selected = useMemo(() => {
    if (selectedIndex === null) return null;
    return photos[selectedIndex] ?? null;
  }, [photos, selectedIndex]);

  return (
    <PageShell>
      <section className="mb-8">
        <h1 className="text-3xl font-semibold">Galerie immersive</h1>
        <p className="mt-2 text-foreground/75">
          Chaque image est une emotion partagee.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {photos.map((photo, idx) => (
          <motion.button
            key={photo.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.04 }}
            onClick={() => setSelectedIndex(idx)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
          >
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </motion.button>
        ))}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 bg-black/90 p-4">
          <div className="mx-auto flex h-full max-w-5xl flex-col">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-white/85">{selected.title}</p>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
              >
                Fermer
              </button>
            </div>
            <div className="relative flex-1 overflow-hidden rounded-2xl">
              <Image
                src={selected.imageUrl}
                alt={selected.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <button
                type="button"
                onClick={() =>
                  setSelectedIndex((i) =>
                    i === null ? 0 : (i - 1 + photos.length) % photos.length,
                  )
                }
                className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
              >
                Precedente
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedIndex((i) =>
                    i === null ? 0 : (i + 1) % photos.length,
                  )
                }
                className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
              >
                Suivante
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
