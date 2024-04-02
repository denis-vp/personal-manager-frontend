import { useNoteStore } from "../state/noteStore";
import NoteCard from "../components/NoteCard";
import Masonry from "@mui/lab/Masonry";
import Fab from "@mui/material/Fab/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import NoteForm from "../components/NoteForm";

function Notes() {
  const { notes, createNote } = useNoteStore();
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Masonry columns={3} spacing={3} sx={{margin: 0, padding: 0}}>
        {notes.map((note) => (
          <div key={note.id} onClick={() => setSelectedNoteId(note.id)}>
            <NoteCard note={note} selected={selectedNoteId === note.id} />
          </div>
        ))}
      </Masonry>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", right: 16, bottom: 16 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      <NoteForm open={open} setOpen={setOpen} confirmText="Add" onConfirm={createNote} />
    </>
  );
}

export default Notes;
