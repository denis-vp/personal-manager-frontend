import axios, { AxiosInstance, AxiosResponse } from "axios";
import { create } from "zustand";
import { Note } from "./noteStore";
import { Task } from "./taskStore";
import { useUserStore } from "./userStore";
import { useSnackBarStore } from "./snackBarStore";

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
  getUnassociatedNotes: (
    page: number,
    pageSize: number
  ) => Promise<AxiosResponse>;
  getNote: (id: string) => Promise<AxiosResponse>;
  postNote: (note: Note) => Promise<AxiosResponse>;
  patchNote: (note: Note) => Promise<AxiosResponse>;
  deleteNote: (id: string) => Promise<AxiosResponse>;

  getTasks: (page: number, pageSize: number) => Promise<AxiosResponse>;
  getTask: (id: string) => Promise<AxiosResponse>;
  postTask: (task: Task) => Promise<AxiosResponse>;
  patchTask: (task: Task) => Promise<AxiosResponse>;
  deleteTask: (id: string) => Promise<AxiosResponse>;

  auth: (
    email: string,
    password: string,
    code: string
  ) => Promise<AxiosResponse>;
  logout: () => Promise<AxiosResponse>;
  verifyUser: (token: string) => Promise<AxiosResponse>;

  getUser: (id: string) => Promise<AxiosResponse>;
  createUser: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<AxiosResponse>;
};

export const useApiStore = create<ApiStore>()((set, get) => {
  const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    timeout: 1000,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const { accessToken } = useUserStore.getState();

      config.headers.Authorization = `Bearer ${accessToken}`;
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
    async (error) => {
      if (error.code === "ERR_NETWORK") {
        get().setIsServerOnline(false);
      } else if (error.response.status === 401) {
        // Refresh token
        try {
          const { setAccessToken } = useUserStore.getState();

          const response = await get().axiosInstance.post("/users/refresh");
          // console.log("Refreshed token", response.data.accessToken);

          setAccessToken(response.data.accessToken);
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return get().axiosInstance(originalRequest);
        } catch (error) {
          // If refresh token fails, log out
          const { setUser, setAccessToken, setIsConnected } =
            useUserStore.getState();
          const { setOpenAlert, setAlertText } = useSnackBarStore.getState();
          // console.error("Token refresh failed: " + error);
          setAlertText("Session expired. Please log in again.");
          setOpenAlert(true);

          setUser(null);
          setAccessToken("");
          setIsConnected(false);
        }
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

    auth: async (email: string, password: string, code: string) => {
      return await axiosInstance.post("/users/login", {
        email,
        password,
        code,
      });
    },
    logout: async () => {
      return await axiosInstance.delete("/users/logout");
    },
    verifyUser: async (token: string) => {
      return await axiosInstance.patch(`/users/verify?token=${token}`);
    },

    getUser: async (id: string) => {
      return await axiosInstance.get(`/users/${id}`);
    },
    createUser: async (
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ) => {
      return await axiosInstance.post("/users/create", {
        firstName,
        lastName,
        email,
        password,
      });
    },
  };
});
