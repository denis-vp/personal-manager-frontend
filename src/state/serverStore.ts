import { create } from "zustand";

type ServerStore = {
  isOnline: boolean;
  getIsOnline: () => boolean;
  setIsOnline: (isOnline: boolean) => void;
};

export const useServerStore = create<ServerStore>((set, get) => ({
  isOnline: true,
  getIsOnline: () => get().isOnline,
  setIsOnline: (isOnline: boolean) => set({ isOnline }),
}));
