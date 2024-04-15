import { Note } from "../state/noteStore";

export const validateNote = (note: Note): boolean => {
    if (note.title === '' || note.content === '') {
        return false;
    }
    return true;
}