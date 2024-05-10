import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { DeleteOutline } from "@mui/icons-material";
import dayjs from "dayjs";
import NotesIcon from "@mui/icons-material/Notes";
import Divider from "@mui/material/Divider/Divider";
import { Checkbox, FormControlLabel, Stack } from "@mui/material";
import TaskAssociatedNotes from "./TaskAssociatedNotes";
import { useState } from "react";
import { Task, useTaskStore } from "../../state/taskStore";
import { useApiStore } from "../../state/apiStore";
import { useSnackBarStore } from "../../state/snackBarStore";

type TaskItemProps = {
  task: Task;
  selected: boolean;
  onEdit: () => void;
};

function TaskItem({ task, selected, onEdit }: TaskItemProps) {
  const { deleteTask: deletTaskApi } = useApiStore();
  const { updateTask, deleteTask: deleteTaskStore } = useTaskStore();
  const { setAlertText, setOpenAlert } = useSnackBarStore();

  const [openAssociatedNotes, setOpenAssociatedNotes] = useState(false);

  const theme = useTheme();

  const deleteTaskLocal = (id: string) => {
    deletTaskApi(id)
      .then((response) => {
        if (response.status === 204) {
          deleteTaskStore(id);
        } else if (response.status === 404) {
          setAlertText("Task not found");
          setOpenAlert(true);
        } else {
          setAlertText("Failed to delete task");
          setOpenAlert(true);
        }
      })
      .catch((error) => {
        setAlertText(error.message);
        setOpenAlert(true);
      });
  };

  const handleFinish = () => {
    const newTask: Task = {
      ...task,
      isFinished: !task.isFinished,
    };
    updateTask(newTask);
  };

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
              <IconButton onClick={() => setOpenAssociatedNotes(true)}>
                <NotesIcon />
              </IconButton>
              <FormControlLabel
                autoFocus
                label="Finished"
                control={
                  <Checkbox checked={task.isFinished} onChange={handleFinish} />
                }
                sx={{ margin: "0 1.2em 0 0.6em" }}
              />
              <IconButton onClick={onEdit}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteTaskLocal(task.id)}>
                <DeleteOutline />
              </IconButton>
            </>
          }
          title={task.title}
          subheader={task.category}
        />
        <CardContent>
          <Typography variant="body1" color="textSecondary">
            {task.content}
          </Typography>

          {task.dueDate === "" && task.priority === "" ? null : (
            <Divider sx={{ margin: "0.5em 0 0.5em 0" }} />
          )}

          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography
              variant="body2"
              sx={{
                color: dayjs(task.dueDate).isBefore(dayjs())
                  ? "red"
                  : "textSecondary",
              }}
            >
              {task.dueDate === null
                ? ""
                : dayjs(task.dueDate).format("MMM D, YYYY")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color:
                  task.priority === "high"
                    ? "red"
                    : task.priority === "medium"
                    ? "orange"
                    : "green",
              }}
            >
              {task.priority === ""
                ? ""
                : task.priority.charAt(0).toUpperCase() +
                  task.priority.slice(1)}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      <TaskAssociatedNotes
        task={task}
        open={openAssociatedNotes}
        setOpen={setOpenAssociatedNotes}
      />
    </>
  );
}

export default TaskItem;
