import { useNoteStore } from "../state/noteStore";
import NoteCard from "../components/NoteCard";
import Masonry from "@mui/lab/Masonry";
import Fab from "@mui/material/Fab/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

function Notes() {
  const { notes } = useNoteStore();
  const [selectedNoteId, setSelectedNoteId] = useState("");

  return (
    <>
      <Masonry columns={3} spacing={2} sx={{margin: 0, padding: 0}}>
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
      >
        <AddIcon />
      </Fab>
    </>
  );
}

export default Notes;
