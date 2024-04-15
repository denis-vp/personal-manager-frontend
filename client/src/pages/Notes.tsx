import { Note, useNoteStore } from "../state/noteStore";
import NoteCard from "../components/NoteCard";
import Masonry from "@mui/lab/Masonry";
import Fab from "@mui/material/Fab/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import NoteForm from "../components/NoteForm";
import { apiPatchNote, apiPostNote } from "../utils/apiCalls";
import { useSnackBarStore } from "../state/snackBarStore";
import { validateNote } from "../validators/noteValidator";

function Notes() {
  const { loadNotes, getNotes, createNote, updateNote, setDirty } = useNoteStore();
  const { setOpenAlert, setAlertText } = useSnackBarStore();
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  useEffect(() => {
    loadNotes(3, 5, setOpenAlert, setAlertText);
  }, []);

  const createNoteLocal = (note: Note) => {
    apiPostNote(note)
      .then((response) => {
        setAlertText("Note created");
        setOpenAlert(true);
        createNote(response.data);
        setDirty(false);
      })
      .catch((error) => {
        if (!error.response) {
          setAlertText("Network error");
          if (validateNote(note)) createNote(note);
          setDirty(true);
        } else if (error.response.status === 400) {
          setAlertText("Invalid note");
          setDirty(false);
        }
        setOpenAlert(true);
      })
      .finally(() => {
        setOpenCreate(false);
      });
  };

  const updateNoteLocal = (note: Note) => {
    apiPatchNote(note)
      .then((response) => {
        setAlertText("Note updated");
        setOpenAlert(true);
        updateNote(response.data);
        setDirty(false);
      })
      .catch((error) => {
        if (!error.response) {
          setAlertText("Network error");
          if (validateNote(note)) updateNote(note);
          setDirty(true);
        }
        if (error.response.status === 404) {
          setAlertText("Note not found");
          setDirty(false);
        } else if (error.response.status === 400) {
          setAlertText("Invalid note");
          setDirty(false);
        }
        setOpenAlert(true);
      })
      .finally(() => {
        setOpenUpdate(false);
      });
  };

  return (
    <>
      <Masonry columns={3} spacing={3} sx={{ margin: 0, padding: 0 }}>
        {getNotes().map((note) => (
          <div key={note.id} onClick={() => setSelectedNoteId(note.id)}>
            <NoteCard
              note={note}
              selected={selectedNoteId === note.id}
              onEdit={() => setOpenUpdate(true)}
            />
          </div>
        ))}
      </Masonry>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", right: 16, bottom: 16 }}
        onClick={() => setOpenCreate(true)}
      >
        <AddIcon />
      </Fab>

      <NoteForm
        text="Add note"
        confirmText="Add"
        open={openCreate}
        setOpen={setOpenCreate}
        onConfirm={(note) => createNoteLocal(note)}
      />
      <NoteForm
        text="Edit note"
        confirmText="Edit"
        open={openUpdate}
        setOpen={setOpenUpdate}
        onConfirm={(note) => updateNoteLocal(note)}
        note={getNotes().filter((n) => n.id === selectedNoteId)[0]}
      />
    </>
  );
}

export default Notes;
