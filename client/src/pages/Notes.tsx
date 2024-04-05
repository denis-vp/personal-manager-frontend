import { useNoteStore } from "../state/noteStore";
import NoteCard from "../components/NoteCard";
import Masonry from "@mui/lab/Masonry";
import Fab from "@mui/material/Fab/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import NoteForm from "../components/NoteForm";
import AlertSnackBar from "../components/AlertSnackBar";

function Notes() {
  const { notes, createNote, updateNote } = useNoteStore();
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  return (
    <>
      <Masonry columns={3} spacing={3} sx={{ margin: 0, padding: 0 }}>
        {notes.map((note) => (
          <div key={note.id} onClick={() => setSelectedNoteId(note.id)}>
            <NoteCard
              note={note}
              selected={selectedNoteId === note.id}
              onEdit={() => setOpenUpdate(true)}
              onDelete={() => {
                setAlertText("Deleted note");
                setOpenAlert(true);
              }}
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
        onConfirm={(note) => {
          setAlertText("Created note");
          setOpenAlert(true);
          createNote(note);
        }}
      />
      <NoteForm
        text="Edit note"
        confirmText="Edit"
        open={openUpdate}
        setOpen={setOpenUpdate}
        onConfirm={(note) => {
          setAlertText("Edited note");
          setOpenAlert(true);
          updateNote(note);
        }}
        note={notes.filter((n) => n.id === selectedNoteId)[0]}
      />

      <AlertSnackBar open={openAlert} setOpen={setOpenAlert} text={alertText} />
    </>
  );
}

export default Notes;
