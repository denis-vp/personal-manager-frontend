import { create } from "zustand";

type SnackBarStore = {
    openAlert: boolean;
    alertText: string;
    setOpenAlert: (openAlert: boolean) => void;
    setAlertText: (alertText: string) => void;
}

export const useSnackBarStore = create<SnackBarStore>()(
    (set) => ({
        openAlert: false,
        alertText: "",
        setOpenAlert: (openAlert: boolean) => set({ openAlert }),
        setAlertText: (alertText: string) => set({ alertText }),
    })
)