import { useEffect, useState } from "react";
import { Task, useTaskStore } from "../state/taskStore";
import { useSnackBarStore } from "../state/snackBarStore";
import Stack from "@mui/material/Stack/Stack";
import TaskItem from "../components/Task/TaskItem";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab/Fab";
import TaskForm from "../components/Task/TaskForm";
import { apiPatchTask, apiPostTask } from "../utils/apiCalls";

function Tasks() {
  const { loadData, getTasks, createTask, updateTask, setDirty } =
    useTaskStore();
  const { setOpenAlert, setAlertText } = useSnackBarStore();
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  useEffect(() => {
    loadData(1, 1, setOpenAlert, setAlertText);
  }, []);

  const createTaskLocal = (task: Task) => {
    apiPostTask(task)
      .then((response) => {
        setAlertText("Task created");
        setOpenAlert(true);
        createTask(response.data);
        setDirty(false);
      })
      .catch((error) => {
        if (!error.response) {
          setAlertText("Network error");
          createTask(task);
          setDirty(true);
        }
        if (error.response.status === 400) {
          setAlertText("Invalid task");
          setDirty(false);
        }
        setOpenAlert(true);
      })
      .finally(() => {
        setOpenCreate(false);
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
      })
      .finally(() => {
        setOpenUpdate(false);
      });
  };

  return (
    <>
      <Stack spacing={2}>
        {getTasks().map((task) => (
          <div key={task.id} onClick={() => setSelectedNoteId(task.id)}>
            <TaskItem
              task={task}
              selected={selectedNoteId === task.id}
              onEdit={() => setOpenUpdate(true)}
            />
          </div>
        ))}
      </Stack>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", right: 16, bottom: 16 }}
        onClick={() => setOpenCreate(true)}
      >
        <AddIcon />
      </Fab>

      <TaskForm
        text="Add task"
        confirmText="Add"
        open={openCreate}
        setOpen={setOpenCreate}
        onConfirm={(task) => createTaskLocal(task)}
      />
      <TaskForm
        text="Edit task"
        confirmText="Edit"
        open={openUpdate}
        setOpen={setOpenUpdate}
        onConfirm={(task) => updateTaskLocal(task)}
        task={getTasks().filter((t) => t.id === selectedNoteId)[0]}
      />
    </>
  );
}

export default Tasks;
