import { create } from "zustand"
import { v4 as uuidv4 } from 'uuid';
import { loremIpsum } from 'lorem-ipsum';

const placeholderNotes: Note[] = Array.from({ length: 10 }, (_, i) => ({
    id: uuidv4(),
    title: `Note ${i + 1}`,
    category: "todos",
    content: loremIpsum({ count: Math.floor(Math.random() * 10) + 1, units: 'sentences' }),
    date: new Date().toISOString().slice(0, 10),
}));

export type Note = {
    id: string
    title: string
    category: string
    content: string
    date: string
}

type NoteStore = {
    notes: Note[]
    createNote: (note: Note) => void
    updateNote: (note: Note) => void
    deleteNote: (id: string) => void
}

export const useNoteStore = create<NoteStore>((set) => ({
    notes: placeholderNotes,
    createNote: (note: Note) => {
        note.id = uuidv4()
        set((state) => ({ notes: [...state.notes, note] }))
    },
    updateNote: (note: Note) => {
        set((state) => ({ notes: state.notes.map((n) => (n.id === note.id ? note : n)) }))
    },
    deleteNote: (id: string) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }))
    }
}));

