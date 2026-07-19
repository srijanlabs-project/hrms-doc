import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext } from "react";
import { getCurrentSession, type SessionUser } from "../../lib/api/auth";

interface AuthContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  refresh: () => void;
  /** Clears the cached session immediately (e.g. right after logout) instead of waiting on a refetch. */
  clear: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Bootstraps "who am I" once on load via the session cookie; no token is ever held in JS. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["session"],
    queryFn: getCurrentSession,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const value: AuthContextValue = {
    user: query.data ?? null,
    isLoading: query.isLoading,
    refresh: () => {
      void queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    clear: () => {
      queryClient.setQueryData(["session"], null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
