import Dialog from "@mui/material/Dialog/Dialog";
import { Note, useNoteStore } from "../../state/noteStore";
import { useSnackBarStore } from "../../state/snackBarStore";
import { Task } from "../../state/taskStore";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import List from "@mui/material/List/List";
import {
  apiGetNote,
  apiGetNotesByTaskId,
  apiPatchNote,
} from "../../utils/apiCalls";
import { useEffect, useState } from "react";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Divider from "@mui/material/Divider/Divider";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import Button from "@mui/material/Button/Button";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import Typography from "@mui/material/Typography/Typography";

type TaskAssociatedNotesProps = {
  task: Task;
  open: boolean;
  setOpen: (open: boolean) => void;
};

function TaskAssociatedNotes({
  task,
  open,
  setOpen,
}: TaskAssociatedNotesProps) {
  const { getNotes } = useNoteStore();
  const [associatedNotes, setAssociatedNotes] = useState<Note[]>([]);
  const { setOpenAlert, setAlertText } = useSnackBarStore();

  useEffect(() => {
    apiGetNotesByTaskId(task.id)
      .then((response) => {
        setAssociatedNotes(response.data);
      })
      .catch((_) => {
        setAlertText("Network error");
        setOpenAlert(true);
      });
  }, [task]);

  const removeAssociatedNote = (noteId: string) => {
    apiGetNote(noteId)
      .then((response) => {
        const note = response.data;
        note.associatedTaskId = "";
        apiPatchNote(note)
          .then(() => {
            setAssociatedNotes(
              associatedNotes.filter((note) => note.id !== noteId)
            );
          })
          .catch((_) => {
            setAlertText("Network error");
            setOpenAlert(true);
          });
      })
      .catch((_) => {
        setAlertText("Network error");
        setOpenAlert(true);
      });
  };

  const addAssociatedNote = (noteId: string) => {
    apiGetNote(noteId)
      .then((response) => {
        const note = response.data;
        note.associatedTaskId = task.id;
        apiPatchNote(note)
          .then(() => {
            setAssociatedNotes([...associatedNotes, note]);
          })
          .catch((_) => {
            setAlertText("Network error");
            setOpenAlert(true);
          });
      })
      .catch((_) => {
        setAlertText("Network error");
        setOpenAlert(true);
      });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Associated Notes</DialogTitle>
      <List>
        {associatedNotes.map((note) => (
          <ListItem disablePadding>
            <ListItemButton onClick={() => removeAssociatedNote(note.id)}>
              <ListItemText primary={note.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {getNotes()
          .filter(
            (note) =>
              !associatedNotes.some(
                (associatedNote) => associatedNote.id === note.id
              )
          )
          .map((note) => (
            <ListItem disablePadding>
              <ListItemButton onClick={() => addAssociatedNote(note.id)}>
                <ListItemText primary={note.title} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>

      {getNotes().length === 0 && (
        <Typography sx={{ alignSelf: "center" }}>No notes available</Typography>
      )}

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskAssociatedNotes;
