import Card from "@mui/material/Card/Card";
import { Note, useNoteStore } from "../state/noteStore";
import IconButton from "@mui/material/IconButton/IconButton";
import CardHeader from "@mui/material/CardHeader/CardHeader";
import { DeleteOutline } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import CardContent from "@mui/material/CardContent/CardContent";
import Typography from "@mui/material/Typography/Typography";

type NoteCardProps = {
  note: Note;
};

function NoteCard({ note}: NoteCardProps) {
  const {deleteNote} = useNoteStore();

  return (
    <>
      <Card elevation={2}>
        <CardHeader
          action={
            <>
              <IconButton>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteNote(note.id)}>
                <DeleteOutline />
              </IconButton>
            </>
          }
          title={note.title}
          subheader={note.category}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {note.content}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}

export default NoteCard;
