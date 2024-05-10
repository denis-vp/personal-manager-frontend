import Button from "@mui/material/Button/Button";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import TextField from "@mui/material/TextField/TextField";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { validateNote } from "../../validators/noteValidator";
import { useSnackBarStore } from "../../state/snackBarStore";
import { Note } from "../../state/noteStore";

type NoteFormProps = {
  text: string;
  confirmText: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: (note: Note) => void;
  note?: Note;
};

function NoteForm({
  text,
  confirmText,
  open,
  setOpen,
  onConfirm,
  note,
}: NoteFormProps) {
  const { setOpenAlert, setAlertText } = useSnackBarStore();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setCategory(note.category);
      setContent(note.content);
    } else {
      setTitle("");
      setCategory("");
      setContent("");
    }
  }, [note]);

  const handleClose = () => {
    setTitle("");
    setCategory("");
    setContent("");
    setOpen(false);
  };

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
      associatedTaskId: note?.associatedTaskId || null,
    };

    try {
      validateNote(newNote);
    } catch (error) {
      if (error instanceof Error) {
        setAlertText("Invalid note: " + error.message);
        setOpenAlert(true);
      }
      return;
    }

    onConfirm(newNote);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{text}</DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title && content) {
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">{confirmText}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default NoteForm;
