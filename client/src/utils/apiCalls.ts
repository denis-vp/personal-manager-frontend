import axios from "axios";
import { Note } from "../state/noteStore";

const server = import.meta.env.VITE_SERVER as string;

export const apiGetNotes = async () => {
    return await axios.get(server + "/notes");
}

export const apiGetNote = async (id: string) => {
    return await axios.get(server + `/notes/${id}`);
}

export const apiPostNote = async (note: Note) => {
    return await axios.post(server + `/notes/create`, note);
}

export const apiPatchNote = async (note: Note) => {
    return await axios.patch(server + `/notes/${note.id}`, note);
}

export const apiDeleteNote = async (id: string) => {
    return await axios.delete(server + `/notes/${id}`);
}
