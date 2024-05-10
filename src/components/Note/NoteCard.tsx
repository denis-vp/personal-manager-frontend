import Card from "@mui/material/Card/Card";
import IconButton from "@mui/material/IconButton/IconButton";
import CardHeader from "@mui/material/CardHeader/CardHeader";
import { DeleteOutline } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import CardContent from "@mui/material/CardContent/CardContent";
import Typography from "@mui/material/Typography/Typography";
import { useTheme } from "@mui/material/styles";
import { Note, useNoteStore } from "../../state/noteStore";
import { useApiStore } from "../../state/apiStore";
import { useSnackBarStore } from "../../state/snackBarStore";

type NoteCardProps = {
  note: Note;
  selected: boolean;
  onEdit: () => void;
};

function NoteCard({ note, selected, onEdit }: NoteCardProps) {
  const { deleteNote: deleteNoteApi } = useApiStore();
  const { deleteNote: deleteNoteStore } = useNoteStore();
  const { setAlertText, setOpenAlert } = useSnackBarStore();

  const theme = useTheme();

  const deleteNoteLocal = (id: string) => {
    deleteNoteApi(id)
    .then((response) => {
      if (response.status === 204) {
        deleteNoteStore(id);
      } else if (response.status === 404) {
        setAlertText("Note not found");
        setOpenAlert(true);
      } else {
        setAlertText("Failed to delete note");
        setOpenAlert(true);
      }
    })
    .catch((error) => {
      setAlertText(error.message);
      setOpenAlert(true);
    });
  }

  return (
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
            <IconButton onClick={() => deleteNoteLocal(note.id)}>
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
  );
}

export default NoteCard;
