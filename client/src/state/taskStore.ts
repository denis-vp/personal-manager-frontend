import { create } from "zustand";
import { apiGetTasks } from "../utils/apiCalls";

const tasksLocalStorage = import.meta.env.VITE_TASKS_LOCAL_STORAGE as string;

export type Task = {
  id: string;
  title: string;
  category: string;
  content: string;
  isFinished: boolean;
  dueDate: string | null;
  priority: string; // low, medium, high or ""
};

type TaskStore = {
  tasks: Task[];
  loadTasks: (page: number, pageSize: number) => void;
  getTasks: () => Task[];
  getTask: (id: string) => Task | undefined;
  setTasks: (expenses: Task[]) => void;
  createTask: (expense: Task) => void;
  updateTask: (expense: Task) => void;
  deleteTask: (id: string) => void;
};

export const useTaskStore = create<TaskStore>()((set, get) => ({
  tasks: [],
  dirty: false,
  loadTasks: (page: number, pageSize: number) => {
    apiGetTasks(page, pageSize)
      .then((response) => {
        set({ tasks: [...get().tasks, ...response.data] });
      })
      .catch((_) => {});
  },
  getTasks: () => get().tasks,
  getTask: (id: string) => get().tasks.find((e) => e.id === id),
  setTasks: (expenses: Task[]) => set({ tasks: expenses }),
  createTask: (expense: Task) => {
    set({ tasks: [...get().tasks, expense] });
  },
  updateTask: (expense: Task) => {
    set({
      tasks: get().tasks.map((e) => (e.id === expense.id ? expense : e)),
    });
  },
  deleteTask: (id: string) => {
    set({ tasks: get().tasks.filter((e) => e.id !== id) });
  },
}));
