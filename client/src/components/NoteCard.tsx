import Card from "@mui/material/Card/Card";
import { Note, useNoteStore } from "../state/noteStore";
import IconButton from "@mui/material/IconButton/IconButton";
import CardHeader from "@mui/material/CardHeader/CardHeader";
import { DeleteOutline } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import CardContent from "@mui/material/CardContent/CardContent";
import Typography from "@mui/material/Typography/Typography";
import { useTheme } from "@mui/material/styles";

type NoteCardProps = {
  note: Note;
  selected: boolean;
  onEdit: () => void;
};

function NoteCard({ note, selected, onEdit }: NoteCardProps) {
  const { deleteNote } = useNoteStore();
  const theme = useTheme();

  return (
    <>
      <Card
        elevation={2}
        sx={{
          borderColor: selected ? theme.palette.primary.main : "transparent",
          borderWidth: 2,
          borderStyle: "solid",
        }}
      >
        <CardHeader
          action={
            <>
              <IconButton onClick={onEdit}>
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => deleteNote(note.id)}
              >
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
