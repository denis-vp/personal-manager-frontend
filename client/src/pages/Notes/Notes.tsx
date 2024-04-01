import { useNoteStore } from '../../state/noteStore';
import NoteCard from '../../components/NoteCard';
import Masonry from 'react-masonry-css';
import styles from './Notes.module.css'

function Notes() {
  const {notes} = useNoteStore();

  return <>
    <Masonry
      breakpointCols={{default: 3, 1100: 2, 700: 1}}
      className={styles.myMasonryGrid}
      columnClassName={styles.myMasonryGridColumn}
    >
      {notes.map((note) => (
        <div key={note.id}>
          <NoteCard
            note={note}
          />
        </div>
      
      ))}
    </Masonry>
  </>;
}

export default Notes;
