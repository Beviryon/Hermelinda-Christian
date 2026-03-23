import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DEMO_LOGIN_CODE, isDemoMode } from "@/lib/demo-mode";
import { AccessCodeDoc, GuestMessage, PhotoItem } from "@/lib/types";

type DemoStore = {
  accessCodes: AccessCodeDoc[];
  messages: GuestMessage[];
  photos: PhotoItem[];
};

const DEMO_STORAGE_KEY = "wedding_demo_store_v1";

const defaultDemoStore: DemoStore = {
  accessCodes: [
    {
      code: DEMO_LOGIN_CODE,
      name: "Invite Demo",
      isActive: true,
      isAdmin: true,
      sessionId: null,
      lastLoginAt: null,
    },
  ],
  messages: [
    {
      id: "demo-message-1",
      name: "Sophie",
      message: "Magnifique journee, felicitation aux maries !",
      createdAt: new Date(),
    },
  ],
  photos: [
    {
      id: "demo-photo-1",
      title: "Entree",
      imageUrl: "https://picsum.photos/id/1040/1200/800",
    },
    {
      id: "demo-photo-2",
      title: "Ceremonie",
      imageUrl: "https://picsum.photos/id/1060/1200/800",
    },
    {
      id: "demo-photo-3",
      title: "Soiree",
      imageUrl: "https://picsum.photos/id/1039/1200/800",
    },
  ],
};

function getDbOrThrow(): Firestore {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }
  return db;
}

function readDemoStore(): DemoStore {
  if (typeof window === "undefined") return defaultDemoStore;
  const raw = localStorage.getItem(DEMO_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(defaultDemoStore));
    return defaultDemoStore;
  }
  try {
    const parsed = JSON.parse(raw) as DemoStore;
    return {
      accessCodes: parsed.accessCodes ?? defaultDemoStore.accessCodes,
      messages: (parsed.messages ?? []).map((message) => ({
        ...message,
        createdAt: message.createdAt ? new Date(message.createdAt) : undefined,
      })),
      photos: parsed.photos?.length ? parsed.photos : defaultDemoStore.photos,
    };
  } catch {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(defaultDemoStore));
    return defaultDemoStore;
  }
}

function writeDemoStore(store: DemoStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(store));
}

export async function getAccessCode(code: string) {
  if (isDemoMode) {
    const store = readDemoStore();
    const found =
      store.accessCodes.find((item) => item.code === code.toUpperCase()) ?? null;
    return found ? { ...found, isAdmin: Boolean(found.isAdmin) } : null;
  }

  const ref = doc(getDbOrThrow(), "access_codes", code);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  const data = snapshot.data() as AccessCodeDoc;
  return { ...data, isAdmin: Boolean(data.isAdmin) };
}

export async function updateAccessCodeSession(code: string, sessionId: string) {
  if (isDemoMode) {
    const store = readDemoStore();
    store.accessCodes = store.accessCodes.map((item) =>
      item.code === code
        ? { ...item, sessionId, lastLoginAt: new Date().toISOString() }
        : item,
    );
    writeDemoStore(store);
    return;
  }

  const ref = doc(getDbOrThrow(), "access_codes", code);
  await updateDoc(ref, {
    sessionId,
    lastLoginAt: serverTimestamp(),
  });
}

export async function createAccessCode(
  code: string,
  name: string,
  isAdmin = false,
) {
  const normalizedCode = code.trim().toUpperCase();
  if (isDemoMode) {
    const store = readDemoStore();
    if (store.accessCodes.some((item) => item.code === normalizedCode)) {
      throw new Error("Code already exists");
    }
    store.accessCodes.push({
      code: normalizedCode,
      name: name.trim() || "Invite",
      isActive: true,
      isAdmin,
      sessionId: null,
      lastLoginAt: null,
    });
    writeDemoStore(store);
    return;
  }

  await setDoc(doc(getDbOrThrow(), "access_codes", normalizedCode), {
    code: normalizedCode,
    name: name.trim() || "Invite",
    isActive: true,
    isAdmin,
    sessionId: null,
    lastLoginAt: null,
  });
}

export async function setAccessCodeActiveState(code: string, isActive: boolean) {
  if (isDemoMode) {
    const store = readDemoStore();
    store.accessCodes = store.accessCodes.map((item) =>
      item.code === code ? { ...item, isActive } : item,
    );
    writeDemoStore(store);
    return;
  }

  const ref = doc(getDbOrThrow(), "access_codes", code);
  await updateDoc(ref, { isActive });
}

export async function listAccessCodes() {
  if (isDemoMode) {
    const store = readDemoStore();
    return [...store.accessCodes]
      .map((item) => ({ ...item, isAdmin: Boolean(item.isAdmin) }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  const q = query(collection(getDbOrThrow(), "access_codes"), orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => {
    const data = item.data() as AccessCodeDoc;
    return { ...data, isAdmin: Boolean(data.isAdmin) };
  });
}

export async function addGuestMessage(name: string, message: string) {
  if (isDemoMode) {
    const store = readDemoStore();
    store.messages.unshift({
      id: crypto.randomUUID(),
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date(),
    });
    writeDemoStore(store);
    return;
  }

  await addDoc(collection(getDbOrThrow(), "messages"), {
    name: name.trim(),
    message: message.trim(),
    createdAt: serverTimestamp(),
  });
}

export async function listGuestMessages() {
  if (isDemoMode) {
    const store = readDemoStore();
    return [...store.messages].sort((a, b) => {
      const aTs = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTs = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTs - aTs;
    });
  }

  const q = query(collection(getDbOrThrow(), "messages"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => {
    const data = item.data();
    return {
      id: item.id,
      name: String(data.name || ""),
      message: String(data.message || ""),
      createdAt: data.createdAt?.toDate?.() as Date | undefined,
    } satisfies GuestMessage;
  });
}

export async function listPhotos() {
  if (isDemoMode) {
    const store = readDemoStore();
    return store.photos;
  }

  const q = query(collection(getDbOrThrow(), "photos"), orderBy("title", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => {
    const data = item.data();
    return {
      id: item.id,
      title: String(data.title || "Souvenir"),
      imageUrl: String(data.imageUrl || ""),
      description: data.description ? String(data.description) : undefined,
    } satisfies PhotoItem;
  });
}
