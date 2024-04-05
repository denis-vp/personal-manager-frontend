import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "./components/Layout";
import Notes from "./pages/Notes";
import Tasks from "./pages/Tasks";
import Expenses from "./pages/Expenses";
import Events from "./pages/Events";
import { useNoteStore } from "./state/noteStore";
import { useEffect, useRef } from "react";
import axios, { AxiosInstance } from "axios";

const server = import.meta.env.VITE_SERVER as string;

const theme = createTheme({});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout children={<Dashboard />} />,
  },
  {
    path: "/tasks",
    element: <Layout children={<Tasks />} />,
  },
  {
    path: "/notes",
    element: <Layout children={<Notes />} />,
  },
  {
    path: "/expenses",
    element: <Layout children={<Expenses />} />,
  },
  {
    path: "/events",
    element: <Layout children={<Events />} />,
  },
]);

function App() {
  const { setNotes } = useNoteStore();
  const axiosInstance = useRef<AxiosInstance | null>(null);

  useEffect(() => {
    if (axiosInstance.current !== null) return;
    
    axiosInstance.current = axios.create({ baseURL: server });

    axiosInstance.current.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          console.log("Retrying request in 5 seconds...");
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(axiosInstance.current?.request(error.config));
            }, 1000 * 5);
          });
        }

        return Promise.reject(error);
      }
    );

    axiosInstance.current
      .get(server + "/notes")
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
