import { useNoteStore } from "../state/noteStore";
import NoteCard from "../components/NoteCard";
import Masonry from "@mui/lab/Masonry";
import Fab from "@mui/material/Fab/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import NoteForm from "../components/NoteForm";

function Notes() {
  const { notes, createNote, updateNote } = useNoteStore();
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  return (
    <>
      <Masonry columns={3} spacing={3} sx={{ margin: 0, padding: 0 }}>
        {notes.map((note) => (
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
        onConfirm={(note) => createNote(note)}
      />
      <NoteForm
        text="Edit note"
        confirmText="Edit"
        open={openUpdate}
        setOpen={setOpenUpdate}
        onConfirm={(note) => updateNote(note)}
        note={notes.filter((n) => n.id === selectedNoteId)[0]}
      />
    </>
  );
}

export default Notes;
