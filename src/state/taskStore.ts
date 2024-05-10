import { create } from "zustand";

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
  setTasks: (tasks: Task[]) => void;
  getTask: (id: string) => Task | undefined;

  createTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
};

export const useTaskStore = create<TaskStore>()((set, get) => {
  return {
    tasks: [],
    setTasks: (tasks: Task[]) => set({ tasks }),
    getTask: (id: string) => get().tasks.find((t) => t.id === id),

    createTask: (task: Task) => {
      set({ tasks: [...get().tasks, task] });
    },
    updateTask: (task: Task) => {
      set({
        tasks: get().tasks.map((t) => (t.id === task.id ? task : t)),
      });
    },
    deleteTask: (id: string) => {
      set({ tasks: get().tasks.filter((t) => t.id !== id) });
    },
  };
});
