import axios, { AxiosInstance, AxiosResponse } from "axios";
import { create } from "zustand";
import { Note } from "./noteStore";
import { Task } from "./taskStore";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

type ApiStore = {
  axiosInstance: AxiosInstance;

  isServerOnline: boolean;
  setIsServerOnline: (isOnline: boolean) => void;

  ping: () => Promise<AxiosResponse>;

  getNotes: (page: number, pageSize: number) => Promise<AxiosResponse>;
  getNotesByTaskId: (
    page: number,
    pageSize: number,
    taskId: string
  ) => Promise<AxiosResponse>;
  getUnassociatedNotes: (page: number, pageSize: number) => Promise<AxiosResponse>;
  getNote: (id: string) => Promise<AxiosResponse>;
  postNote: (note: Note) => Promise<AxiosResponse>;
  patchNote: (note: Note) => Promise<AxiosResponse>;
  deleteNote: (id: string) => Promise<AxiosResponse>;

  getTasks: (page: number, pageSize: number) => Promise<AxiosResponse>;
  getTask: (id: string) => Promise<AxiosResponse>;
  postTask: (task: Task) => Promise<AxiosResponse>;
  patchTask: (task: Task) => Promise<AxiosResponse>;
  deleteTask: (id: string) => Promise<AxiosResponse>;
};

export const useApiStore = create<ApiStore>()((set, get) => {
  const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      if (error.code === "ERR_NETWORK") {
        get().setIsServerOnline(false);
      }
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      if (get().isServerOnline === false) {
        get().setIsServerOnline(true);
      }
      return response;
    },
    (error) => {
      if (error.code === "ERR_NETWORK") {
        get().setIsServerOnline(false);
      }
      return Promise.reject(error);
    }
  );

  return {
    axiosInstance,
    isServerOnline: true,
    setIsServerOnline: (isOnline: boolean) => set({ isServerOnline: isOnline }),

    ping: async () => {
      return await axiosInstance.get("/ping");
    },

    getNotes: async (page: number, pageSize: number) => {
      return await axiosInstance.get(`/notes?page=${page}&limit=${pageSize}`);
    },
    getNotesByTaskId: async (
      page: number,
      pageSize: number,
      taskId: string
    ) => {
      return await axiosInstance.get(
        `/notes/task/${taskId}?page=${page}&limit=${pageSize}`
      );
    },
    getUnassociatedNotes: async (page: number, pageSize: number) => {
      return await axiosInstance.get(
        `/notes/unassociated?page=${page}&limit=${pageSize}`
      );
    },
    getNote: async (id: string) => {
      return await axiosInstance.get(`/notes/${id}`);
    },
    postNote: async (note: Note) => {
      return await axiosInstance.post(`/notes/create`, note);
    },
    patchNote: async (note: Note) => {
      return await axiosInstance.patch(`/notes/${note.id}`, note);
    },
    deleteNote: async (id: string) => {
      return await axiosInstance.delete(`/notes/${id}`);
    },

    getTasks: async (page: number, pageSize: number) => {
      return await axiosInstance.get(`/tasks?page=${page}&limit=${pageSize}`);
    },
    getTask: async (id: string) => {
      return await axiosInstance.get(`/tasks/${id}`);
    },
    postTask: async (task: Task) => {
      return await axiosInstance.post(`/tasks/create`, task);
    },
    patchTask: async (task: Task) => {
      return await axiosInstance.patch(`/tasks/${task.id}`, task);
    },
    deleteTask: async (id: string) => {
      return await axiosInstance.delete(`/tasks/${id}`);
    },
  };
});
