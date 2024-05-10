import { Note } from "../state/noteStore";

export const validateNote = (note: Note) => {
    const errors = [];
    
    if (note.title === '') {
        errors.push('Title is required');
    }
    if (note.content === '') {
        errors.push('Content is required');
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};
