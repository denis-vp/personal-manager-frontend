import Button from "@mui/material/Button/Button";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import TextField from "@mui/material/TextField/TextField";
import { useState } from "react";
import { Note } from "../state/noteStore";
import { v4 as uuidv4 } from "uuid";

type NoteFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  confirmText: string;
  onConfirm: (note: Note) => void;
  note?: Note;
};

function NoteForm({
  open,
  setOpen,
  confirmText,
  onConfirm,
  note,
}: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const handleOnConfirm = (
    title: string,
    category: string,
    content: string
  ) => {
    const newNote: Note = {
      id: note?.id || uuidv4(),
      title,
      category,
      content,
      date: new Date().toISOString().slice(0, 10),
    };

    onConfirm(newNote);

    setTitle("");
    setCategory("");
    setContent("");
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Add a new note</DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title && category && content) {
            setOpen(false);
            handleOnConfirm(title, category, content);
          }
        }}
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            autoFocus
            margin="dense"
            label="Category"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit">{confirmText}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default NoteForm;
