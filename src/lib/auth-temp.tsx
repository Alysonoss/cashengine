import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import type { RoleKey } from "@/components/app/app-shell-context";

export type TempUser = {
  id: string;
  username: string;
  name: string;
  email: string;
  role: RoleKey;
  isAdminGlobal: boolean;
  createdAt: string;
};

type TempUserWithPassword = TempUser & { password: string };

const MOCK_USERS: TempUserWithPassword[] = [
  {
    id: "user-001",
    username: "nightmare",
    password: "Ke170707",
    name: "Nightmare Admin",
    email: "nightmare@cashengine.pro",
    role: "admin_global",
    isAdminGlobal: true,
    createdAt: "2025-01-15T10:30:00.000Z",
  },
  {
    id: "user-002",
    username: "produtor",
    password: "produtor123",
    name: "Produtor Demo",
    email: "produtor@demo.com",
    role: "produtor",
    isAdminGlobal: false,
    createdAt: "2025-02-20T14:00:00.000Z",
  },
  {
    id: "user-003",
    username: "afiliado",
    password: "afiliado123",
    name: "Afiliado Demo",
    email: "afiliado@demo.com",
    role: "afiliado",
    isAdminGlobal: false,
    createdAt: "2025-03-10T09:15:00.000Z",
  },
];

const STORAGE_KEY = "cash-engine-session";
const COOKIE_KEY = "session-token";
const AUTH_EVENT = "cash-engine-auth-changed";

type TempSession = {
  jwt: string;
  user: TempUser;
};

type TempAuthContextValue = {
  user: TempUser | null;
  isAuthed: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<TempUser | null>;
  logout: () => void;
  isAdminGlobal: boolean;
};

const TempAuthContext = createContext<TempAuthContextValue | null>(null);

function base64Encode(obj: unknown): string {
  if (typeof window === "undefined") return "";
  try {
    return btoa(encodeURIComponent(JSON.stringify(obj)));
  } catch {
    return "";
  }
}

function base64Decode(str: string): unknown | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(decodeURIComponent(atob(str)));
  } catch {
    return null;
  }
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  const parts: string[] = [`${name}=${value}`, `path=/`, `max-age=${maxAgeSeconds}`];
  document.cookie = parts.join("; ");
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? (match[2] as string) : null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

function makeFakeJwt(user: TempUser): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 604800,
    }),
  );
  const sign = btoa("cash-engine-mock-signature");
  return `${header}.${payload}.${sign}`;
}

function readSessionFromStorage(): TempSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const cookieVal = getCookie(COOKIE_KEY);
      if (cookieVal) {
        const decoded = base64Decode(cookieVal);
        if (decoded && typeof decoded === "object" && "user" in decoded && "jwt" in decoded) {
          return decoded as TempSession;
        }
      }
      return null;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "user" in parsed && "jwt" in parsed) {
      return parsed as TempSession;
    }
    return null;
  } catch {
    return null;
  }
}

function writeSessionToStorage(session: TempSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  setCookie(COOKIE_KEY, base64Encode(session), 604800);
}

function clearSessionFromStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  deleteCookie(COOKIE_KEY);
}

function dispatchAuthChanged() {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent(AUTH_EVENT));
  } catch {
  }
}

export function TempAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<TempUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = readSessionFromStorage();
    if (session && session.user) {
      setUser(session.user);
    }
    setIsLoading(false);
  }, []);

  async function login(username: string, password: string): Promise<TempUser | null> {
    await new Promise((r) => setTimeout(r, 500));
    const found = MOCK_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password,
    );
    if (!found) return null;

    const { password: _pw, ...rest } = found;
    const sessionUser: TempUser = rest;
    const jwt = makeFakeJwt(sessionUser);
    const session: TempSession = { jwt, user: sessionUser };
    writeSessionToStorage(session);
    setUser(sessionUser);
    dispatchAuthChanged();
    return sessionUser;
  }

  function logout() {
    clearSessionFromStorage();
    setUser(null);
    dispatchAuthChanged();
    if (typeof window !== "undefined") {
      router.navigate({ to: "/login", replace: true }).catch(() => {
        window.location.href = "/login";
      });
    }
  }

  const value: TempAuthContextValue = {
    user,
    isAuthed: !!user,
    isLoading,
    login,
    logout,
    isAdminGlobal: !!user?.isAdminGlobal || user?.role === "admin_global",
  };

  return <TempAuthContext.Provider value={value}>{children}</TempAuthContext.Provider>;
}

export function useTempAuth() {
  const ctx = useContext(TempAuthContext);
  if (!ctx) {
    return {
      user: null,
      isAuthed: false,
      isLoading: false,
      login: async () => null,
      logout: () => {},
      isAdminGlobal: false,
    };
  }
  return ctx;
}
