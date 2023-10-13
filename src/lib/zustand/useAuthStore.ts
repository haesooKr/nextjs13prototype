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
    }
  )
);

export default useAuthStore;

// https://docs.pmnd.rs/zustand/integrations/persisting-store-data
