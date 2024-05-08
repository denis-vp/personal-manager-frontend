import { create } from "zustand";
import { apiGetNotes } from "../utils/apiCalls";

const notesLocalStorage = import.meta.env.VITE_NOTES_LOCAL_STORAGE as string;
const dirtyNotesLocalStorage = import.meta.env
  .VITE_DIRTY_NOTES_LOCAL_STORAGE as string;

export type Note = {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  associatedTaskId: string | null;
};

export type DirtyNote = {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  associatedTaskId: string | null;
  existed: boolean;
  deleted: boolean;
};

type NoteStore = {
  notes: Note[];
  notePage: number;
  getNotePage: () => number;
  setNotePage: (page: number) => void;
  dirtyNotes: DirtyNote[];
  loadNotesLocalStorage: () => void;
  loadDirtyNotesLocalStorage: () => void;
  loadNotes: (page: number, pageSize: number) => void;
  getNotes: () => Note[];
  getDirtyNotes: () => DirtyNote[];
  getNote: (id: string) => Note | undefined;
  setNotes: (notes: Note[]) => void;
  setDirtyNotes: (dirtyNotes: DirtyNote[]) => void;
  createNote: (note: Note) => void;
  createDirtyNote: (note: DirtyNote) => void;
  updateNote: (note: Note) => void;
  updateDirtyNote: (note: DirtyNote) => void;
  deleteNote: (id: string) => void;
  deleteDirtyNote: (id: string) => void;
  isDirty: (id: string) => boolean;
  setBackOnline: () => void;
};

export const useNoteStore = create<NoteStore>()((set, get) => ({
  notes: [],
  notePage: 1,
  getNotePage: () => get().notePage,
  setNotePage: (page: number) => set({ notePage: page }),
  dirtyNotes: [],
  loadNotesLocalStorage: () => {
    const notes = JSON.parse(localStorage.getItem(notesLocalStorage) || "[]");
    set({ notes });
  },
  loadDirtyNotesLocalStorage: () => {
    const dirtyNotes = JSON.parse(
      localStorage.getItem(dirtyNotesLocalStorage) || "[]"
    );
    set({ dirtyNotes });
  },
  loadNotes: (page: number, pageSize: number) => {
    apiGetNotes(page, pageSize)
      .then((response) => {
        set({ notes: [...get().notes, ...response.data] });
        localStorage.setItem(notesLocalStorage, JSON.stringify(get().notes));
      })
      .catch((_) => {});
  },
  getNotes: () => {
    let allNotes = get().notes;
    get().dirtyNotes.forEach((dirtyNote) => {
      if (dirtyNote.deleted) return;
      const note: Note = {
        id: dirtyNote.id,
        title: dirtyNote.title,
        category: dirtyNote.category,
        content: dirtyNote.content,
        date: dirtyNote.date,
        associatedTaskId: dirtyNote.associatedTaskId,
      };
      allNotes = [...allNotes, note];
    });
    return allNotes;
  },
  getDirtyNotes: () => get().dirtyNotes,
  getNote: (id: string) => {
    const note = get().notes.find((n) => n.id === id);
    if (note) {
      return note;
    }
    const dirtyNote = get().dirtyNotes.find((n) => n.id === id);
    if (dirtyNote) {
      return {
        id: dirtyNote.id,
        title: dirtyNote.title,
        category: dirtyNote.category,
        content: dirtyNote.content,
        date: dirtyNote.date,
        associatedTaskId: dirtyNote.associatedTaskId,
      };
    }
  },
  setNotes: (notes: Note[]) => {
    set({ notes });
    localStorage.setItem(notesLocalStorage, JSON.stringify(notes));
  },
  setDirtyNotes: (dirtyNotes: DirtyNote[]) => {
    set({ dirtyNotes });
    localStorage.setItem(dirtyNotesLocalStorage, JSON.stringify(dirtyNotes));
  },
  createNote: (note: Note) => {
    set({ notes: [...get().notes, note] });
    localStorage.setItem(notesLocalStorage, JSON.stringify(get().notes));
  },
  createDirtyNote: (note: DirtyNote) => {
    set({ dirtyNotes: [...get().dirtyNotes, note] });
    localStorage.setItem(
      dirtyNotesLocalStorage,
      JSON.stringify(get().dirtyNotes)
    );
  },
  updateNote: (note: Note) => {
    set({
      notes: get().notes.map((n) => (n.id === note.id ? note : n)),
    });
    localStorage.setItem(notesLocalStorage, JSON.stringify(get().notes));
  },
  updateDirtyNote: (note: DirtyNote) => {
    set({
      dirtyNotes: get().dirtyNotes.map((n) => (n.id === note.id ? note : n)),
    });
    localStorage.setItem(
      dirtyNotesLocalStorage,
      JSON.stringify(get().dirtyNotes)
    );
  },
  deleteNote: (id: string) => {
    set({ notes: get().notes.filter((n) => n.id !== id) });
    localStorage.setItem(notesLocalStorage, JSON.stringify(get().notes));
  },
  deleteDirtyNote: (id: string) => {
    set({ dirtyNotes: get().dirtyNotes.filter((n) => n.id !== id) });
    localStorage.setItem(
      dirtyNotesLocalStorage,
      JSON.stringify(get().dirtyNotes)
    );
  },
  isDirty: (id: string) => get().dirtyNotes.some((n) => n.id === id),
  setBackOnline: () => {
    localStorage.setItem(dirtyNotesLocalStorage, JSON.stringify([]));
    set({ notes: []});
    set({ dirtyNotes: [] });
    set({ notePage: 1 });
  },
}));
