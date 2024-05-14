import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type UserStore = {
  user: Partial<User> | null;
  setUser: (user: Partial<User> | null) => void;

  accessToken: string;
  setAccessToken: (accessToken: string) => void;

  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: Partial<User> | null) => set({ user }),

      accessToken: "",
      setAccessToken: (accessToken: string) => set({ accessToken }),

      isConnected: false,
      setIsConnected: (isConnected: boolean) => set({ isConnected }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
