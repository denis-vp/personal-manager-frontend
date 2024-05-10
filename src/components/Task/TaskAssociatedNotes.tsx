import Dialog from "@mui/material/Dialog/Dialog";
import { useSnackBarStore } from "../../state/snackBarStore";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import List from "@mui/material/List/List";
import { useCallback, useEffect, useRef, useState } from "react";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Divider from "@mui/material/Divider/Divider";
import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import Button from "@mui/material/Button/Button";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import Typography from "@mui/material/Typography/Typography";
import { useApiStore } from "../../state/apiStore";
import { Note } from "../../state/noteStore";
import { Task } from "../../state/taskStore";

const PAGE_SIZE = 25;

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
  const { getNotesByTaskId, getUnassociatedNotes, getNote, patchNote } = useApiStore();
  const { setOpenAlert, setAlertText } = useSnackBarStore();

  const [associatedNotes, setAssociatedNotes] = useState<Note[]>([]);
  const [unassociatedNotes, setUnassociatedNotes] = useState<Note[]>([]);

  const [associatedPage, setAssociatedPage] = useState(1);
  const associatedObserver = useRef<IntersectionObserver | null>(null);
  const [unassociatedPage, setUnassociatedPage] = useState(1);
  const unassociatedObserver = useRef<IntersectionObserver | null>(null);

  const lastAssociatedElementRef = useCallback((node: HTMLElement | null) => {
    if (associatedObserver.current) associatedObserver.current.disconnect();
    associatedObserver.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setAssociatedPage((prev) => prev + 1);
      }
    });
    if (node) associatedObserver.current.observe(node);
  }, []);

  const lastUnassociatedElementRef = useCallback((node: HTMLElement | null) => {
    if (unassociatedObserver.current) unassociatedObserver.current.disconnect();
    unassociatedObserver.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setUnassociatedPage((prev) => prev + 1);
      }
    });
    if (node) unassociatedObserver.current.observe(node);
  }, []);

  const [resetNotes, setResetNotes] = useState(false);

  useEffect(() => {
    setAssociatedNotes([]);
    setUnassociatedNotes([]);
    setAssociatedPage(1);
    setUnassociatedPage(1);
    setResetNotes(true);
  }, [open]);

  useEffect(() => {
    if (resetNotes) {
      loadAssociatedNotes();
      setResetNotes(false);
    }
  }, [resetNotes]);

  useEffect(() => {
    if (!resetNotes) {
      loadAssociatedNotes();
    }
  }, [associatedPage]);

  useEffect(() => {
    if (resetNotes) {
      loadUnassociatedNotes();
      setResetNotes(false);
    }
  }, [resetNotes]);

  useEffect(() => {
    if (!resetNotes) {
      loadUnassociatedNotes();
    }
  }, [unassociatedPage]);

  const loadAssociatedNotes = () => {
    getNotesByTaskId(associatedPage, PAGE_SIZE, task.id)
      .then((response) => {
        setAssociatedNotes([...associatedNotes, ...response.data]);
      })
      .catch(() => {
        setAlertText("Network error");
        setOpenAlert(true);
      });
  };

  const loadUnassociatedNotes = () => {
    getUnassociatedNotes(unassociatedPage, PAGE_SIZE)
      .then((response) => {
        setUnassociatedNotes([...unassociatedNotes, ...response.data]);
      })
      .catch(() => {
        setAlertText("Network error");
        setOpenAlert(true);
      });
  };

  const removeAssociatedNote = (noteId: string) => {
    getNote(noteId)
      .then((response) => {
        const note = response.data;
        note.associatedTaskId = null;
        patchNote(note)
          .then(() => {
            setAssociatedNotes(
              associatedNotes.filter((note) => note.id !== noteId)
            );
            setUnassociatedNotes([...unassociatedNotes, note]);
          })
          .catch(() => {
            setAlertText("Network error");
            setOpenAlert(true);
          });
      })
      .catch(() => {
        setAlertText("Network error");
        setOpenAlert(true);
      });
  };

  const addAssociatedNote = (noteId: string) => {
    getNote(noteId)
      .then((response) => {
        const note = response.data;
        note.associatedTaskId = task.id;
        patchNote(note)
          .then(() => {
            setUnassociatedNotes(
              unassociatedNotes.filter((note) => note.id !== noteId)
            );
            setAssociatedNotes([...associatedNotes, note]);
          })
          .catch(() => {
            setAlertText("Network error");
            setOpenAlert(true);
          });
      })
      .catch(() => {
        setAlertText("Network error");
        setOpenAlert(true);
      });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle sx={{ alignSelf: "center" }}>Associated Notes</DialogTitle>
      <List>
        {associatedNotes.map((note, index) => {
          if (associatedNotes.length === index + 1) {
            return (
              <ListItem
                disablePadding
                key={note.id}
                ref={lastAssociatedElementRef}
              >
                <ListItemButton onClick={() => removeAssociatedNote(note.id)}>
                  <ListItemText primary={note.title} />
                </ListItemButton>
              </ListItem>
            );
          } else {
            return (
              <ListItem disablePadding key={note.id}>
                <ListItemButton onClick={() => removeAssociatedNote(note.id)}>
                  <ListItemText primary={note.title} />
                </ListItemButton>
              </ListItem>
            );
          }
        })}
      </List>

      {associatedNotes.length === 0 && (
        <Typography sx={{ alignSelf: "center", paddingBottom: "1em" }}>
          No notes associated
        </Typography>
      )}

      <Divider />

      <DialogTitle sx={{ alignSelf: "center" }}>Available Notes</DialogTitle>
      <List>
        {unassociatedNotes.map((note, index) => {
          if (unassociatedNotes.length === index + 1) {
            return (
              <ListItem
                disablePadding
                key={note.id}
                ref={lastUnassociatedElementRef}
              >
                <ListItemButton onClick={() => addAssociatedNote(note.id)}>
                  <ListItemText primary={note.title} />
                </ListItemButton>
              </ListItem>
            );
          } else {
            return (
              <ListItem disablePadding key={note.id}>
                <ListItemButton onClick={() => addAssociatedNote(note.id)}>
                  <ListItemText primary={note.title} />
                </ListItemButton>
              </ListItem>
            );
          }
        })}
      </List>

      {unassociatedNotes.length === 0 && (
        <Typography sx={{ alignSelf: "center" }}>No notes available</Typography>
      )}

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskAssociatedNotes;
