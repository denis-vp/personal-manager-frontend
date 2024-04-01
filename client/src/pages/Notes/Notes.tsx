import { useNoteStore } from "../../state/noteStore";
import NoteCard from "../../components/NoteCard";
import Masonry from "react-masonry-css";
import styles from "./Notes.module.css";
import Fab from "@mui/material/Fab/Fab";
import AddIcon from "@mui/icons-material/Add";

function Notes() {
  const { notes } = useNoteStore();

  return (
    <>
      <Masonry
        breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
        className={styles.myMasonryGrid}
        columnClassName={styles.myMasonryGridColumn}
      >
        {notes.map((note) => (
          <div key={note.id}>
            <NoteCard note={note} />
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
