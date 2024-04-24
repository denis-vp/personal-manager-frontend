import { Note, useNoteStore } from "../state/noteStore";
import NoteCard from "../components/Note/NoteCard";
import Masonry from "@mui/lab/Masonry";
import Fab from "@mui/material/Fab/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useRef, useState } from "react";
import NoteForm from "../components/Note/NoteForm";
import { apiPatchNote, apiPostNote } from "../utils/apiCalls";
import { useSnackBarStore } from "../state/snackBarStore";

function Notes() {
  const { loadNotes, getNotes, createNote, updateNote } =
    useNoteStore();
  const { setOpenAlert, setAlertText } = useSnackBarStore();
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastNoteElementRef = useCallback((node: any) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    loadNotes(page, 25);
  }, [page]);

  const createNoteLocal = (note: Note) => {
    apiPostNote(note)
      .then((response) => {
        setAlertText("Note created");
        setOpenAlert(true);
        createNote(response.data);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setAlertText("Invalid note");
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
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setAlertText("Note not found");
        } else if (error.response.status === 400) {
          setAlertText("Invalid note");
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
        {getNotes().map((note, index) => {
          if (getNotes().length === index + 1) {
            return (
              <div
                ref={lastNoteElementRef}
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
              >
                <NoteCard
                  note={note}
                  selected={selectedNoteId === note.id}
                  onEdit={() => setOpenUpdate(true)}
                />
              </div>
            );
          } else {
            return (
              <div key={note.id} onClick={() => setSelectedNoteId(note.id)}>
                <NoteCard
                  note={note}
                  selected={selectedNoteId === note.id}
                  onEdit={() => setOpenUpdate(true)}
                />
              </div>
            );
          }
        })}
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
