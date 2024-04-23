import { Note } from "../model/note";
import pool from "../postgresDatabase";

export const getNotes = async () => {
    const result = await pool.query('SELECT * FROM public."notes"');
    return result.rows;
};

export const getNote = async (id: string) => {
    const result = await pool.query('SELECT * FROM public."notes" WHERE id = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error("Note not found");
    }
    return result.rows[0];
}

export const addNote = async (note: Note) => {
    const result = await pool.query('INSERT INTO public."notes" (id, title, category, content, date, associatedtaskid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [note.id, note.title, note.category, note.content, note.date, note.associatedTaskId]);
    if (result.rowCount === 0) {
        throw new Error("Note not added");
    }
};

export const updateNote = async (id: string, note: Note) => {
    const result = await pool.query('UPDATE public."notes" SET title = $2, category = $3, content = $4, date = $5, associatedtaskid = $6 WHERE id = $1 RETURNING *', [id, note.title, note.category, note.content, note.date, note.associatedTaskId]);
    if (result.rowCount === 0) {
        throw new Error("Note not found");
    }
    return result.rows[0];
};

export const deleteNote = async (id: string) => {
    const result = await pool.query('DELETE FROM public."notes" WHERE id = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error("Note not found");
    }
}

export const getNotesByTaskId = async (taskId: string) => {
    const result = await pool.query('SELECT * FROM public."notes" WHERE associatedtaskid = $1', [taskId]);
    return result.rows;
}

export default { getNotes, getNote, addNote, updateNote, deleteNote, getNotesByTaskId };