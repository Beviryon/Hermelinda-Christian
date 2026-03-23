"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";

const navItems = [
  { href: "/home", label: "Accueil", requiresAuth: false },
  { href: "/story", label: "Histoire", requiresAuth: true },
  { href: "/gallery", label: "Galerie", requiresAuth: true },
  { href: "/video", label: "Video", requiresAuth: true },
  { href: "/music", label: "Musique", requiresAuth: true },
  { href: "/guestbook", label: "Livre d'or", requiresAuth: true },
  { href: "/admin", label: "Admin", requiresAuth: true, requiresAdmin: true },
];

export function PageShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { status, session, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = status === "authenticated";

  const renderedNavItems = useMemo(
    () =>
      navItems
        .filter((item) => !(item.requiresAdmin && !session?.isAdmin))
        .map((item) => ({
          ...item,
          isLocked: item.requiresAuth && !isAuthenticated,
          href: item.requiresAuth && !isAuthenticated ? "/login" : item.href,
        })),
    [isAuthenticated, session?.isAdmin],
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/home" className="group">
            <p className="text-sm uppercase tracking-[0.2em] text-primary/80">
              Hermelinda & Christian
            </p>
            <p className="text-xs text-foreground/60">04 Avril 2026</p>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-border/70 bg-white/70 px-2 py-1 lg:flex">
            {renderedNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  {item.label} {item.isLocked ? "•" : ""}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <p className="hidden text-xs text-foreground/70 sm:block">
                  {session?.name ?? "Invite"}
                </p>
                <button
                  type="button"
                  onClick={logout}
                  className="hidden rounded-full border border-border bg-white px-3 py-1.5 text-xs hover:bg-muted sm:block"
                >
                  Deconnexion
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition hover:brightness-95 sm:block"
              >
                Entrer avec un code
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-xl border border-border bg-white p-2 lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="mt-1 block h-0.5 w-5 bg-foreground" />
              <span className="mt-1 block h-0.5 w-5 bg-foreground" />
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-border/60 bg-white/95 px-4 py-3 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {renderedNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-3 py-2 text-sm ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {item.label} {item.isLocked ? "• verrouille" : ""}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </header>

      <nav className="fixed bottom-4 left-1/2 z-30 flex w-[min(94vw,640px)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full border border-border/60 bg-white/90 px-2 py-2 shadow-lg backdrop-blur lg:hidden">
        {renderedNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={`mobile-${item.label}`}
              href={item.href}
              className={`shrink-0 rounded-full px-3 py-2 text-xs ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/75"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8 pb-28 sm:px-6 lg:pb-8">
        {children}
      </main>

      <footer className="border-t border-border/60 bg-white/70 pb-24 lg:pb-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="font-medium text-foreground">Developpe par Trevixia</p>
            <p className="text-foreground/70">
              Solutions digitales & automatisation
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
            <Link
              href="/marie"
              className="inline-flex w-fit items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Maries
            </Link>
            <a
              href="https://trevixia-web.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Visiter Trevixia
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
