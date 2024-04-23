import { create } from "zustand";
import { apiGetNotes } from "../utils/apiCalls";

const notesLocalStorage = import.meta.env.VITE_NOTES_LOCAL_STORAGE as string;

export type Note = {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  associatedTaskId: string | null;
};

type NoteStore = {
  notes: Note[];
  dirty: boolean;
  loadData: (
    numTries: number,
    waitTime: number,
    setOpenAlert: (open: boolean) => void,
    setAlertText: (text: string) => void
  ) => void;
  loadNotes: (
    numTries: number,
    waitTime: number,
    setOpenAlert: (open: boolean) => void,
    setAlertText: (text: string) => void
  ) => void;
  getNotes: () => Note[];
  getNote: (id: string) => Note | undefined;
  setNotes: (notes: Note[]) => void;
  createNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  setDirty: (dirty: boolean) => void;
};

export const useNoteStore = create<NoteStore>()((set, get) => ({
  notes: [],
  dirty: false,
  loadData: (
    numTries: number,
    waitTime: number,
    setOpenAlert: (open: boolean) => void,
    setAlertText: (text: string) => void
  ) => {
    get().loadNotes(numTries, waitTime, setOpenAlert, setAlertText);
    localStorage.setItem(notesLocalStorage, JSON.stringify(get().notes));
  },
  loadNotes: (
    numTries: number,
    waitTime: number,
    setOpenAlert: (open: boolean) => void,
    setAlertText: (text: string) => void
  ) => {
    apiGetNotes()
      .then((response) => {
        set({ notes: response.data });
      })
      .catch((error) => {
        if (!error.response) {
          if (numTries > 0) {
            setAlertText(
              `Can not connect to server, retrying in ${waitTime} second(s)...`
            );
            setOpenAlert(true);
            setTimeout(() => {
              get().loadNotes(
                numTries - 1,
                waitTime,
                setOpenAlert,
                setAlertText
              );
            }, 1000 * waitTime);
          } else {
            setAlertText("Can not connect to server, using local storage");
            setOpenAlert(true);
            const notes = localStorage.getItem(notesLocalStorage);
            set({ notes: notes ? JSON.parse(notes) : [] });
          }
        } else {
          setAlertText("Error loading notes");
          setOpenAlert(true);
        }
      });
  },
  getNotes: () => get().notes,
  getNote: (id: string) => get().notes.find((n) => n.id === id),
  setNotes: (notes: Note[]) => set({ notes }),
  createNote: (note: Note) => {
    set({ notes: [...get().notes, note] });
    localStorage.setItem(notesLocalStorage, JSON.stringify(get().notes));
  },
  updateNote: (note: Note) => {
    set({
      notes: get().notes.map((n) => (n.id === note.id ? note : n)),
    });
    localStorage.setItem(notesLocalStorage, JSON.stringify(get().notes));
  },
  deleteNote: (id: string) => {
    set({ notes: get().notes.filter((n) => n.id !== id) });
    localStorage.setItem(notesLocalStorage, JSON.stringify(get().notes));
  },
  setDirty: (dirty: boolean) => {
    set({ dirty });
  },
}));
