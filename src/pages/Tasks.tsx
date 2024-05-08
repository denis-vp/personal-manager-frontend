import { useCallback, useEffect, useRef, useState } from "react";
import { Task, useTaskStore } from "../state/taskStore";
import { useSnackBarStore } from "../state/snackBarStore";
import Stack from "@mui/material/Stack/Stack";
import TaskItem from "../components/Task/TaskItem";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab/Fab";
import TaskForm from "../components/Task/TaskForm";
import { apiPatchTask, apiPostTask } from "../utils/apiCalls";

function Tasks() {
  const { loadTasks, setTasks, getTasks, createTask, updateTask } = useTaskStore();
  const { setOpenAlert, setAlertText } = useSnackBarStore();
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastNoteElementRef = useCallback((node: any) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    setTasks([]);
  }, []);

  useEffect(() => {
    loadTasks(page, 25);
  }, [page]);

  const createTaskLocal = (task: Task) => {
    apiPostTask(task)
      .then((response) => {
        setAlertText("Task created");
        setOpenAlert(true);
        createTask(response.data);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setAlertText("Invalid task");
          setOpenAlert(true);
        }
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
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setAlertText("Task not found");
          setOpenAlert(true);
        } else if (error.response.status === 400) {
          setAlertText("Invalid task");
          setOpenAlert(true);
        }
      })
      .finally(() => {
        setOpenUpdate(false);
      });
  };

  return (
    <>
      <Stack spacing={2}>
        {getTasks().map((task, index) => {
          if (getTasks().length === index + 1) {
            return (
              <div
                ref={lastNoteElementRef}
                key={task.id}
                onClick={() => setSelectedNoteId(task.id)}
              >
                <TaskItem
                  task={task}
                  selected={selectedNoteId === task.id}
                  onEdit={() => setOpenUpdate(true)}
                />
              </div>
            );
          } else {
            return (
              <div key={task.id} onClick={() => setSelectedNoteId(task.id)}>
                <TaskItem
                  task={task}
                  selected={selectedNoteId === task.id}
                  onEdit={() => setOpenUpdate(true)}
                />
              </div>
            );
          }
        })}
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
