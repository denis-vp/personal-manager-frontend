import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { loremIpsum } from "lorem-ipsum";
import cors from "cors";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.NODE_ENV === "test" ? 0 : process.env.PORT;

export type Note = {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
};

const placeholderNotes: Note[] = Array.from({ length: 20 }, (_, i) => ({
  id: uuidv4(),
  title: `Note ${i + 1}`,
  category: "todos",
  content: loremIpsum({
    count: Math.floor(Math.random() * 10) + 1,
    units: "sentences",
  }),
  date: new Date().toISOString().slice(0, 10),
}));
placeholderNotes.push({
  id: "1",
  title: "A Note",
  category: "todos",
  content: "This is a note",
  date: new Date().toISOString().slice(0, 10),
})

export let notes: Note[] = placeholderNotes;

app.get("/notes", (req: Request, res: Response) => {
  res.status(200);
  res.json(notes);
});

app.get("/notes/:id", (req: Request, res: Response) => {
  const note = notes.find((n) => n.id === req.params.id);

  if (note) {
    res.status(200);
    res.json(note);
  } else {
    res.status(404).json({ message: "Note not found" });
  }
});

app.post("/notes/create", (req: Request, res: Response) => {
  const note: Note = req.body;
  note.id = uuidv4();
  notes.push(note);
  res.status(201);
  res.json(note);
});

app.patch("/notes/:id", (req: Request, res: Response) => {
  const noteIndex = notes.findIndex((n) => n.id === req.params.id);

  if (noteIndex !== -1) {
    notes[noteIndex] = req.body;
    res.status(200);
    res.json(notes[noteIndex])
  } else {
    res.status(404).json({ message: "Note not found" });
  }
});

app.delete("/notes/:id", (req: Request, res: Response) => {
  const noteIndex = notes.findIndex((n) => n.id === req.params.id);

  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    res.status(204);
  } else {
    res.status(404).json({ message: "Note not found" });
  }
  
  res.send();
});

const server = app.listen(port, () => {
  console.group();
  console.log(`Server started at port ${port}`);
  console.groupEnd();
});

export default server;