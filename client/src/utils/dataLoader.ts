import { Task } from "../state/taskStore";
import { Note } from "../state/noteStore";

// TODO: implement upload data on backend coming back online

// TODO: implement this

export const loadData = (numTries: number, waitTime: number, setOpenAlert: (open: boolean) => void, setAlertText: (text: string) => void) => {
    const data: {
        notes: Note[];
        tasks: Task[];
    } = { notes: [], tasks: [] };
};