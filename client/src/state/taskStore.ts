import { create } from "zustand";
import { apiGetTasks } from "../utils/apiCalls";

const tasksLocalStorage = import.meta.env.VITE_TASKS_LOCAL_STORAGE as string;

export type Task = {
  id: string;
  title: string;
  category: string;
  content: string;
  isFinished: boolean;
  dueDate: string;
  priority: string; // low, medium, high or ""
  associatedNotes: string[];
};

type TaskStore = {
  tasks: Task[];
  dirty: boolean;
  loadData: (
    numTries: number,
    waitTime: number,
    setOpenAlert: (open: boolean) => void,
    setAlertText: (text: string) => void
  ) => void;
  loadTasks: (
    numTries: number,
    waitTime: number,
    setOpenAlert: (open: boolean) => void,
    setAlertText: (text: string) => void
  ) => void;
  getTasks: () => Task[];
  getTask: (id: string) => Task | undefined;
  setTasks: (expenses: Task[]) => void;
  createTask: (expense: Task) => void;
  updateTask: (expense: Task) => void;
  deleteTask: (id: string) => void;
  setDirty: (dirty: boolean) => void;
};

export const useTaskStore = create<TaskStore>()((set, get) => ({
  tasks: [],
  dirty: false,
  loadData: (
    numTries: number,
    waitTime: number,
    setOpenAlert: (open: boolean) => void,
    setAlertText: (text: string) => void
  ) => {
    get().loadTasks(numTries, waitTime, setOpenAlert, setAlertText);
    localStorage.setItem(tasksLocalStorage, JSON.stringify(get().tasks));
  },
  loadTasks: (
    numTries: number,
    waitTime: number,
    setOpenAlert: (open: boolean) => void,
    setAlertText: (text: string) => void
  ) => {
    apiGetTasks()
      .then((response) => {
        set({ tasks: response.data });
      })
      .catch((error) => {
        if (!error.response) {
          if (numTries > 0) {
            setAlertText(
              `Can not connect to server, retrying in ${waitTime} second(s)...`
            );
            setOpenAlert(true);
            setTimeout(() => {
              get().loadTasks(
                numTries - 1,
                waitTime,
                setOpenAlert,
                setAlertText
              );
            }, 1000 * waitTime);
          } else {
            setAlertText("Can not connect to server, using local storage");
            setOpenAlert(true);
            const tasks = localStorage.getItem(tasksLocalStorage);
            set({ tasks: tasks ? JSON.parse(tasks) : [] });
          }
        } else {
          setAlertText("Error loading tasks");
          setOpenAlert(true);
        }
      });
  },
  getTasks: () => get().tasks,
  getTask: (id: string) => get().tasks.find((e) => e.id === id),
  setTasks: (expenses: Task[]) => set({ tasks: expenses }),
  createTask: (expense: Task) => {
    set({ tasks: [...get().tasks, expense] });
    localStorage.setItem(tasksLocalStorage, JSON.stringify(get().tasks));
  },
  updateTask: (expense: Task) => {
    set({
      tasks: get().tasks.map((e) => (e.id === expense.id ? expense : e)),
    });
    localStorage.setItem(tasksLocalStorage, JSON.stringify(get().tasks));
  },
  deleteTask: (id: string) => {
    set({ tasks: get().tasks.filter((e) => e.id !== id) });
    localStorage.setItem(tasksLocalStorage, JSON.stringify(get().tasks));
  },
  setDirty: (dirty: boolean) => {
    set({ dirty });
  },
}));

const loadTasks = (
  numTries: number,
  waitTime: number,
  setOpenAlert: (open: boolean) => void,
  setAlertText: (text: string) => void
) => {
  apiGetTasks()
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (!error.response) {
        if (numTries > 0) {
          setAlertText(
            `Failed to load tasks. Retrying in ${waitTime} seconds...`
          );
          setOpenAlert(true);
          return setTimeout(() => {
            loadTasks(numTries - 1, waitTime, setOpenAlert, setAlertText);
          }, 1000 * waitTime);
        } else {
          setAlertText("Failed to load tasks, using local storage");
          setOpenAlert(true);
          const tasks = localStorage.getItem(tasksLocalStorage);
          return tasks ? JSON.parse(tasks) : [];
        }
      } else {
        setAlertText("Failed to load tasks");
        setOpenAlert(true);
      }
    });
  return [];
};
