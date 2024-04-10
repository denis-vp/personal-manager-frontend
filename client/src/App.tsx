import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "./components/Layout";
import Notes from "./pages/Notes";
import Tasks from "./pages/Tasks";
import Expenses from "./pages/Expenses";
import Events from "./pages/Events";
import { useNoteStore } from "./state/noteStore";
import { useEffect, useState } from "react";
import axios, { AxiosInstance } from "axios";
import AlertSnackBar from "./components/AlertSnackBar";

const server = import.meta.env.VITE_SERVER as string;
const webSocketServer = import.meta.env.VITE_SOCKET_SERVER as string;

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
  const {
    openAlert,
    alertText,
    setNotes,
    createNote,
    setOpenAlert,
    setAlertText,
  } = useNoteStore();

  const connect = (axiosInstance: AxiosInstance, ws: WebSocket) => {
    axiosInstance
      .get(server + "/notes")
      .then((response) => {
        setNotes(response.data);

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          createNote(data);
        };
      })
      .catch(() => {
        setAlertText(
          "Could not connect to server. Retrying every 5 seconds..."
        );
        setOpenAlert(true);

        setTimeout(() => {
          connect(axiosInstance, ws);
        }, 1000 * 5);
      });
  };

  useEffect(() => {
    const axiosInstance = axios.create({ baseURL: server });
    const ws = new WebSocket(webSocketServer);
    connect(axiosInstance, ws);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <AlertSnackBar open={openAlert} setOpen={setOpenAlert} text={alertText} />
    </ThemeProvider>
  );
}

export default App;
