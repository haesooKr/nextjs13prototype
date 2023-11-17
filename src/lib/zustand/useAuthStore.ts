import { User } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: null | User;
  login: (user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user: any) => set({ user: user }),
      logout: async () => {
        await fetch("/api/auth/logout");
        set({ user: null });
      },
    }),
    {
      name: "auth",
      onRehydrateStorage: (state) => {
        console.log(state);
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
              if (data.status !== "success") {
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
