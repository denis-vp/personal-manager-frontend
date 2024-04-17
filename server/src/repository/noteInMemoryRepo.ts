import { Note } from "../model/note";

const notes: Note[] = [];

export const getNotes = async () => {
    return notes;
};

export const getNote = async (id: string) => {
    const note = notes.find(note => note.id === id);
    if (!note) {
        throw new Error("Note not found");
    }
    return note;
}

export const addNote = async (note: Note) => {
    notes.push(note);
    return note;
};

export const updateNote = async (id: string, note: Note) => {
    const index = notes.findIndex(note => note.id === id);
    if (index === -1) {
        throw new Error("Note not found");
    }
    notes[index] = note;
    return note;
};

export const deleteNote = async (id: string) => {
    const index = notes.findIndex(note => note.id === id);
    if (index === -1) {
        throw new Error("Note not found");
    }
    notes.splice(index, 1);
}

export const getNotesByTaskId = async (taskId: string) => {
    return notes.filter(note => note.associatedTaskId === taskId);
}

export default { getNotes, getNote, addNote, updateNote, deleteNote, getNotesByTaskId };