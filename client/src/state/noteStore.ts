import { create } from "zustand";
import { apiGetNotes } from "../utils/apiCalls";

const localStorageName = "notes";

export type Note = {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
};

type NoteStore = {
  notes: Note[];
  dirty: boolean;
  loadData: (numTries: number, waitTime: number, setOpenAlert: (open: boolean) => void, setAlertText: (text: string) => void) => void;
  getNotes: () => Note[];
  getNote: (id: string) => Note | undefined;
  setNotes: (notes: Note[]) => void;
  createNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  setDirty: (dirty: boolean) => void;
};

export const useNoteStore = create<NoteStore>()(
  (set, get) => ({
    notes: [],
    dirty: false,
    loadData: (numTries: number, waitTime: number, setOpenAlert: (open: boolean) => void, setAlertText: (text: string) => void) => {
      apiGetNotes().then((response) => {
        set({ notes: response.data });
        localStorage.setItem(localStorageName, JSON.stringify(response.data));
      }).catch((error) => {
        if (numTries > 0) {
          setAlertText(`Cannot connect to server, retrying in ${waitTime} seconds...`);
          setOpenAlert(true);
          setTimeout(() => get().loadData(numTries - 1, waitTime, setOpenAlert, setAlertText), 1000 * waitTime);
          return;
        }
        if (!error.response) {
          setAlertText("Cannot connect to server, using local storage");
          setOpenAlert(true);
          const localData = localStorage.getItem(localStorageName);
          set({ notes: localData ? JSON.parse(localData) : [] });
        }
      });
    },
    getNotes: () => get().notes,
    getNote: (id: string) => get().notes.find((n) => n.id === id),
    setNotes: (notes: Note[]) => set({ notes }),
    createNote: (note: Note) => {
      set({ notes: [...get().notes, note] });
      localStorage.setItem(localStorageName, JSON.stringify(get().notes));
    },
    updateNote: (note: Note) => {
      set({
        notes: get().notes.map((n) => (n.id === note.id ? note : n)),
      });
      localStorage.setItem(localStorageName, JSON.stringify(get().notes));
    },
    deleteNote: (id: string) => {
      set({ notes: get().notes.filter((n) => n.id !== id) });
      localStorage.setItem(localStorageName, JSON.stringify(get().notes));
    },
    setDirty: (dirty: boolean) => {
      if (get().dirty === false && dirty === true) {
        set({ dirty: true });
      } else if (get().dirty === true && dirty === false) {
        set({ dirty: false });
        // TODO: Save notes to the server
      }
    },
  }),
);
