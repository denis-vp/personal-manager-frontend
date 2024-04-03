import { create } from "zustand";
import axios from "axios";

export type Note = {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
};

type NoteStore = {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  createNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
};

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  setNotes: (notes: Note[]) => set({ notes }),
  createNote: (note: Note) => {
    axios
      .post("http://localhost:3000/notes", note)
      .then((response) => {
        set((state) => ({ notes: [...state.notes, response.data] }));
      })
      .catch((error) => {
        console.error(error);
      });
  },
  updateNote: (note: Note) => {
    axios
      .patch(`http://localhost:3000/notes/${note.id}`, note)
      .then((response) => {
        set((state) => ({
          notes: state.notes.map((n) => (n.id === response.data.id ? note : n)),
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  },
  deleteNote: (id: string) => {
    axios
      .delete(`http://localhost:3000/notes/${id}`)
      .then(() => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
      })
      .catch((error) => {
        console.error(error);
      });
  },
}));
