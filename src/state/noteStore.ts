import { create } from "zustand";

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
  setNotes: (notes: Note[]) => void;
  getNote: (id: string) => Note | undefined;

  createNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
};

export const useNoteStore = create<NoteStore>()((set, get) => ({
  notes: [],
  setNotes: (notes: Note[]) => set({ notes }),
  getNote: (id: string) => get().notes.find((n) => n.id === id),

  createNote: async (note: Note) => {
    set({ notes: [...get().notes, note] });
  },
  updateNote: async (note: Note) => {
    set({
      notes: get().notes.map((n) => (n.id === note.id ? note : n)),
    });
  },
  deleteNote: async (id: string) => {
    set({ notes: get().notes.filter((n) => n.id !== id) });
  },
}));
