import { user } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: null | user;
  login: (user: user) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user: any) => set({ user: user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth",
      onRehydrateStorage: (state) => {
        console.log("hydration starts");

        // optional
        return async (state, error) => {
          if (!error) {
            if (state && state.user) {
              const res = await fetch("/api/auth/check", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
              });

              const data = await res.json();
              if (data.message !== "success") {
                state.user = null;
              }
            }
          }
        };
      },
    }
  )
);

export default useAuthStore;

// https://docs.pmnd.rs/zustand/integrations/persisting-store-data
