import { LocalSession } from "@/lib/types";

const STORAGE_KEY = "wedding_access_session";

export function saveLocalSession(session: LocalSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getLocalSession(): LocalSession | null {
  const value = localStorage.getItem(STORAGE_KEY);
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<LocalSession>;
    if (!parsed.code || !parsed.sessionId) return null;
    return {
      code: parsed.code,
      name: parsed.name ?? "Invite",
      sessionId: parsed.sessionId,
      isAdmin: Boolean(parsed.isAdmin),
    };
  } catch {
    return null;
  }
}

export function clearLocalSession() {
  localStorage.removeItem(STORAGE_KEY);
}
