"use client";

export function FullScreenLoader({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="glass-card rounded-2xl px-8 py-6 text-center fade-in">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-primary/25 border-t-primary" />
        <p className="text-sm text-foreground/80">{text}</p>
      </div>
    </div>
  );
}
