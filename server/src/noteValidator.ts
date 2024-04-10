import { Note } from "./index";

export const validateNote = (note: Note): boolean => {
    if (note.title === '' || note.content === '') {
        return false;
    }
    return true;
}