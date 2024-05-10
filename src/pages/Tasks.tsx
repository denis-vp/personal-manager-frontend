import { useCallback, useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack/Stack";
import TaskItem from "../components/Task/TaskItem";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab/Fab";
import TaskForm from "../components/Task/TaskForm";
import { Task, useTaskStore } from "../state/taskStore";
import { useApiStore } from "../state/apiStore";
import { useSnackBarStore } from "../state/snackBarStore";

const PAGE_SIZE = 50;

function Tasks() {
  const { getTasks, postTask, patchTask } = useApiStore();
  const { tasks, setTasks, getTask, createTask, updateTask } = useTaskStore();
  const { setOpenAlert, setAlertText } = useSnackBarStore();

  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [page, setPage] = useState(1);

  const loadTasks = () => {
    getTasks(page, PAGE_SIZE)
      .then((response) => {
        if (response.status === 200) {
          // Make sure an added task is not loaded again when the next page is loaded
          const newTasks = [...tasks, ...response.data];
          const uniqueTasks = Array.from(
            new Set(newTasks.map((task) => task.id))
          ).map((id) => newTasks.find((task) => task.id === id));
          setTasks(uniqueTasks);
        } else {
          setAlertText("Failed to load tasks");
          setOpenAlert(true);
        }
      })
      .catch((error) => {
        setAlertText(error.message);
        setOpenAlert(true);
      });
  };

  useEffect(() => {
    loadTasks();
  }, [page]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastNoteElementRef = useCallback((node: HTMLElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  const createTaskLocal = (task: Task) => {
    postTask(task)
      .then((response) => {
        if (response.status === 201) {
          createTask(response.data);
        } else if (response.status === 400) {
          setAlertText("Invalid task");
          setOpenAlert(true);
        } else {
          setAlertText("Failed to create task");
          setOpenAlert(true);
        }
      })
      .catch((error) => {
        setAlertText(error.message);
        setOpenAlert(true);
      });
  };

  const updateTaskLocal = (task: Task) => {
    patchTask(task)
      .then((response) => {
        if (response.status === 200) {
          updateTask(response.data);
        } else if (response.status === 400) {
          setAlertText("Invalid task");
          setOpenAlert(true);
        } else {
          setAlertText("Failed to update task");
          setOpenAlert(true);
        }
      })
      .catch((error) => {
        setAlertText(error.message);
        setOpenAlert(true);
      });
  };

  return (
    <>
      <Stack spacing={2}>
        {tasks.map((task, index) => (
          <div
            key={task.id}
            onClick={() => setSelectedNoteId(task.id)}
            ref={tasks.length === index + 1 ? lastNoteElementRef : null}
          >
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
        onConfirm={createTaskLocal}
      />
      <TaskForm
        text="Edit task"
        confirmText="Edit"
        open={openUpdate}
        setOpen={setOpenUpdate}
        onConfirm={updateTaskLocal}
        task={getTask(selectedNoteId)}
      />
    </>
  );
}

export default Tasks;
