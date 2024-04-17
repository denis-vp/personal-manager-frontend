import { useSnackBarStore } from "../../state/snackBarStore";
import EditIcon from "@mui/icons-material/Edit";
import { Task, useTaskStore } from "../../state/taskStore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { DeleteOutline } from "@mui/icons-material";
import { apiDeleteTask, apiPatchTask } from "../../utils/apiCalls";
import dayjs from "dayjs";
import NotesIcon from "@mui/icons-material/Notes";
import Divider from "@mui/material/Divider/Divider";
import { Checkbox, FormControlLabel, Stack } from "@mui/material";
import TaskAssociatedNotes from "./TaskAssociatedNotes";
import { useState } from "react";

type TaskItemProps = {
  task: Task;
  selected: boolean;
  onEdit: () => void;
};

function TaskItem({ task, selected, onEdit }: TaskItemProps) {
  const { updateTask, deleteTask, setDirty } = useTaskStore();
  const { setOpenAlert, setAlertText } = useSnackBarStore();
  const [openAssociatedNotes, setOpenAssociatedNotes] = useState(false);
  const theme = useTheme();

  const deleteTaskLocal = (id: string) => {
    apiDeleteTask(id)
      .then(() => {
        setAlertText("Task deleted");
        setOpenAlert(true);
        deleteTask(id);
        setDirty(false);
      })
      .catch((error) => {
        if (!error.response) {
          setAlertText("Network error");
          deleteTask(id);
          setDirty(true);
        } else if (error.response.status === 404) {
          setAlertText("Task not found");
          setDirty(false);
        }
        setOpenAlert(true);
      });
  };

  const updateTaskLocal = (task: Task) => {
    apiPatchTask(task)
      .then((response) => {
        setAlertText("Task updated");
        setOpenAlert(true);
        updateTask(response.data);
        setDirty(false);
      })
      .catch((error) => {
        if (!error.response) {
          setAlertText("Network error");
          updateTask(task);
          setDirty(true);
        }
        if (error.response.status === 404) {
          setAlertText("Task not found");
          setDirty(false);
        } else if (error.response.status === 400) {
          setAlertText("Invalid task");
          setDirty(false);
        }
        setOpenAlert(true);
      });
  };

  const handleFinish = () => {
    const newTask: Task = {
      ...task,
      isFinished: !task.isFinished,
    };
    updateTaskLocal(newTask);
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
              {task.dueDate === ""
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
