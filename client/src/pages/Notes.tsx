import { useNoteStore } from '../state/noteStore';
import NoteCard from '../components/NoteCard';
import Masonry from 'react-masonry-css';

function Notes() {
  const {notes, createNote, updateNote, deleteNote} = useNoteStore();

  return <>
    <Masonry
      breakpointCols={{default: 3, 1100: 2, 700: 1}}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {notes.map((note) => (
        <div key={note.id}>
          <NoteCard
            note={note}
            deleteNote={deleteNote}
          />
        </div>
      
      ))}
    </Masonry>
  </>;
}

export default Notes;
