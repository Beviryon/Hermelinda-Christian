"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearLocalSession, getLocalSession, saveLocalSession } from "@/lib/auth";
import { getAccessCode, updateAccessCodeSession } from "@/lib/firestore";
import { LocalSession } from "@/lib/types";
import { FullScreenLoader } from "@/components/full-screen-loader";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  session: LocalSession | null;
  error: string | null;
  loginWithCode: (code: string) => Promise<boolean>;
  loginAsAdmin: (code: string) => Promise<boolean>;
  logout: () => void;
  verifySession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const publicRoutes = new Set(["/", "/home", "/login", "/marie"]);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<LocalSession | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const logout = useCallback(() => {
    clearLocalSession();
    setSession(null);
    setStatus("unauthenticated");
  }, []);

  const verifySession = useCallback(async () => {
    const localSession = getLocalSession();
    if (!localSession) {
      setSession(null);
      setStatus("unauthenticated");
      return false;
    }

    try {
      const accessCode = await getAccessCode(localSession.code);
      const isValid =
        accessCode &&
        accessCode.isActive &&
        accessCode.sessionId === localSession.sessionId;

      if (!isValid) {
        logout();
        return false;
      }

      const normalizedSession: LocalSession = {
        ...localSession,
        name: accessCode.name || localSession.name || "Invite",
        isAdmin: Boolean(accessCode.isAdmin),
      };
      saveLocalSession(normalizedSession);
      setSession(normalizedSession);
      setStatus("authenticated");
      return true;
    } catch {
      setStatus("unauthenticated");
      setSession(null);
      return false;
    }
  }, [logout]);

  const loginWithCode = useCallback(async (codeInput: string, adminOnly = false) => {
    setError(null);
    const code = codeInput.trim().toUpperCase();
    if (!code) {
      setError("Veuillez entrer un code.");
      return false;
    }

    try {
      const accessCode = await getAccessCode(code);
      if (!accessCode || !accessCode.isActive) {
        setError("Code invalide ou desactive.");
        return false;
      }
      if (adminOnly && !accessCode.isAdmin) {
        setError("Ce code n'a pas l'acces maries.");
        return false;
      }

      const sessionId = crypto.randomUUID();
      await updateAccessCodeSession(code, sessionId);

      const newSession: LocalSession = {
        code,
        name: accessCode.name || "Invite",
        sessionId,
        isAdmin: Boolean(accessCode.isAdmin),
      };

      saveLocalSession(newSession);
      setSession(newSession);
      setStatus("authenticated");
      return true;
    } catch {
      setError("Connexion impossible. Veuillez reessayer.");
      return false;
    }
  }, []);

  const loginAsAdmin = useCallback(
    async (codeInput: string) => loginWithCode(codeInput, true),
    [loginWithCode],
  );

  useEffect(() => {
    // Initial auth bootstrap on first client render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void verifySession();
  }, [verifySession]);

  useEffect(() => {
    if (status === "loading") return;

    const isPublicRoute = publicRoutes.has(pathname);
    if (!isPublicRoute && status !== "authenticated") {
      router.replace("/login");
      return;
    }

    if (pathname === "/admin" && status === "authenticated" && !session?.isAdmin) {
      router.replace("/home");
      return;
    }

    if (pathname === "/login" && status === "authenticated") {
      router.replace("/home");
      return;
    }

    if (pathname === "/marie" && status === "authenticated" && session?.isAdmin) {
      router.replace("/admin");
    }
  }, [pathname, router, session?.isAdmin, status]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const interval = setInterval(() => {
      void verifySession();
    }, 45_000);

    return () => clearInterval(interval);
  }, [status, verifySession]);

  const value = useMemo(
    () => ({
      status,
      session,
      error,
      loginWithCode,
      loginAsAdmin,
      logout,
      verifySession,
    }),
    [error, loginAsAdmin, loginWithCode, logout, session, status, verifySession],
  );

  const isPublicRoute = publicRoutes.has(pathname);
  if (status === "loading") {
    return <FullScreenLoader text="Preparation de votre espace..." />;
  }

  if (!isPublicRoute && status !== "authenticated") {
    return <FullScreenLoader text="Redirection..." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
