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

const port = process.env.PORT;

type Note = {
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

const notes: Note[] = placeholderNotes;

app.get("/notes", (req: Request, res: Response) => {
  res.json(notes);
  res.status(200);
});

app.get("/notes/:id", (req: Request, res: Response) => {
  const note = notes.find((n) => n.id === req.params.id);

  if (note) {
    res.json(note);
    res.status(200);
  } else {
    res.status(404).json({ message: "Note not found" });
  }
});

app.post("/notes", (req: Request, res: Response) => {
  const note: Note = req.body;
  note.id = uuidv4();
  notes.push(note);
  res.json(note);
  res.status(201);
});

app.patch("/notes/:id", (req: Request, res: Response) => {
  const noteIndex = notes.findIndex((n) => n.id === req.params.id);

  if (noteIndex !== -1) {
    notes[noteIndex] = req.body;
    res.json(notes[noteIndex])
    res.status(200);
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