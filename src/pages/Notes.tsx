import NoteCard from "../components/Note/NoteCard";
import Masonry from "@mui/lab/Masonry";
import Fab from "@mui/material/Fab/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useRef, useState } from "react";
import NoteForm from "../components/Note/NoteForm";
import { Note, useNoteStore } from "../state/noteStore";
import { useApiStore } from "../state/apiStore";
import { useSnackBarStore } from "../state/snackBarStore";

const PAGE_SIZE = 50;

function Notes() {
  const { getNotes, postNote, patchNote } = useApiStore();
  const { notes, setNotes, getNote, createNote, updateNote } = useNoteStore();
  const { setOpenAlert, setAlertText } = useSnackBarStore();

  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [page, setPage] = useState(1);

  const loadNotes = () => {
    getNotes(page, PAGE_SIZE)
      .then((response) => {
        if (response.status === 200) {
          // Make sure an added note is not loaded again when the next page is loaded
          const newNotes = [...notes, ...response.data];
          const uniqueNotes = Array.from(
            new Set(newNotes.map((note) => note.id))
          ).map((id) => newNotes.find((note) => note.id === id));
          setNotes(uniqueNotes);
        } else {
          setAlertText("Failed to load notes");
          setOpenAlert(true);
        }
      })
      .catch((error) => {
        setAlertText(error.message);
        setOpenAlert(true);
      });
  };

  useEffect(() => {
    loadNotes();
  }, [page]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastNoteElementRef = useCallback((node: HTMLElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  const createNoteLocal = (note: Note) => {
    postNote(note)
        .then((response) => {
          if (response.status === 201) {
            createNote(response.data);
            setAlertText("Note created");
            setOpenAlert(true);
          } else if (response.status === 400) {
            setAlertText("Invalid note");
            setOpenAlert(true);
          } else {
            setAlertText("Failed to create note");
            setOpenAlert(true);
          }
        })
        .catch((error) => {
          setAlertText(error.message);
          setOpenAlert(true);
        });
  };

  const updateNoteLocal = (note: Note) => {
    patchNote(note)
        .then((response) => {
          if (response.status === 200) {
            updateNote(response.data);
            setAlertText("Note updated");
            setOpenAlert(true);
          } else if (response.status === 400) {
            setAlertText("Invalid note");
            setOpenAlert(true);
          } else if (response.status === 404) {
            setAlertText("Note not found");
            setOpenAlert(true);
          }
        })
        .catch((error) => {
          setAlertText(error.message);
          setOpenAlert(true);
        });
  };

  return (
    <>
      <Masonry columns={3} spacing={3} sx={{ margin: 0, padding: 0 }}>
        {notes.map((note, index) => (
          <div
            key={note.id}
            onClick={() => setSelectedNoteId(note.id)}
            ref={notes.length === index + 1 ? lastNoteElementRef : null}
          >
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
        onConfirm={createNoteLocal}
      />
      <NoteForm
        text="Edit note"
        confirmText="Edit"
        open={openUpdate}
        setOpen={setOpenUpdate}
        onConfirm={updateNoteLocal}
        note={getNote(selectedNoteId)}
      />
    </>
  );
}

export default Notes;
