import Dialog from "@mui/material/Dialog/Dialog";
import { Note, useNoteStore } from "../../state/noteStore";
import { useSnackBarStore } from "../../state/snackBarStore";
import { Task } from "../../state/taskStore";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import List from "@mui/material/List/List";
import { apiGetNote } from "../../utils/apiCalls";
import { useEffect, useState } from "react";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Divider from "@mui/material/Divider/Divider";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import TextField from "@mui/material/TextField/TextField";
import Button from "@mui/material/Button/Button";
import DialogActions from "@mui/material/DialogActions/DialogActions";

type TaskAssociatedNotesProps = {
  task: Task;
  open: boolean;
  setOpen: (open: boolean) => void;
  updateTask: (task: Task) => void;
};

function TaskAssociatedNotes({
  task,
  open,
  setOpen,
  updateTask,
}: TaskAssociatedNotesProps) {
  const { getNotes } = useNoteStore();
  const [associatedNotes, setAssociatedNotes] = useState<Note[]>([]);
  const { setOpenAlert, setAlertText } = useSnackBarStore();

  const getNoteById = async (id: string) => {
    try {
      const response = await apiGetNote(id);
      const note: Note = response.data;
      return note;
    } catch (error) {
      setAlertText("Network error");
      setOpenAlert(true);
      return null;
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const fetchedNotes = await Promise.all(
        task.associatedNotes.map((n) => getNoteById(n))
      );
      setAssociatedNotes(
        fetchedNotes.filter((note): note is Note => note !== null)
      );
    };

    fetchNotes();
  }, [task]);

  const addAssociatedNote = (noteId: string) => {
    const newTask = {
      ...task,
      associatedNotes: [...task.associatedNotes, noteId],
    };
    updateTask(newTask);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Associated Notes</DialogTitle>
      <List>
        {associatedNotes.map((note) => (
          <ListItem disablePadding>
            <ListItemText primary={note.title} />
          </ListItem>
        ))}
      </List>

      {associatedNotes.length > 0 && <Divider />}

      <List>
        {getNotes().map((note) => (
          <ListItem disablePadding>
            <ListItemButton onClick={() => addAssociatedNote(note.id)}>
              <ListItemText primary={note.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {getNotes().length === 0 && <TextField>No notes available</TextField>}

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskAssociatedNotes;
