import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "./components/Layout";
import Notes from "./pages/Notes";
import Tasks from "./pages/Tasks";
import Expenses from "./pages/Expenses";
import Events from "./pages/Events";
import AlertSnackBar from "./components/AlertSnackBar";
import { useSnackBarStore } from "./state/snackBarStore";
import { useEffect } from "react";
import { useServerStore } from "./state/serverStore";
import {
  apiDeleteNote,
  apiPatchNote,
  apiPing,
  apiPostNote,
} from "./utils/apiCalls";
import { Note, useNoteStore } from "./state/noteStore";

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
  const { setBackOnline, getDirtyNotes, deleteDirtyNote, createNote, updateNote, deleteNote } =
    useNoteStore();
  const { openAlert, alertText, setOpenAlert, setAlertText } =
    useSnackBarStore();
  const { getIsOnline, setIsOnline } = useServerStore();

  useEffect(() => {
    const delay = 2;
    const intervalId = setInterval(async () => {
      try {
        const response = await apiPing();
        const isOnline = response.status === 200;
        console.log(isOnline ? "Online" : "Offline");
        if (isOnline && !getIsOnline()) {
          setAlertText("Connected to server, syncing notes...");
          setOpenAlert(true);
          syncNotes();
        }
        setIsOnline(isOnline);
      } catch (error) {
        console.log("Offline");
        setIsOnline(false);
      }
    }, 1000 * delay);

    return () => clearInterval(intervalId);
  }, []);

  const syncNotes = async () => {
    getDirtyNotes().forEach(async (dirtyNote) => {
      deleteDirtyNote(dirtyNote.id);
      const note: Note = {
        id: dirtyNote.id,
        title: dirtyNote.title,
        category: dirtyNote.category,
        content: dirtyNote.content,
        date: dirtyNote.date,
        associatedTaskId: dirtyNote.associatedTaskId,
      };

      try {
        if (dirtyNote.existed === false && dirtyNote.deleted === false) {
          const response = await apiPostNote(note);
          createNote(response.data);
        } else if (dirtyNote.existed === true && dirtyNote.deleted === false) {
          const response = await apiPatchNote(note);
          updateNote(response.data);
        } else if (dirtyNote.existed === true && dirtyNote.deleted === true) {
          const response = await apiDeleteNote(dirtyNote.id);
          deleteNote(response.data.id);
        }
      } catch (error) {
        setAlertText("Failed to sync notes");
        setOpenAlert(true); 
      }
    });

    setBackOnline();
  };

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <AlertSnackBar open={openAlert} setOpen={setOpenAlert} text={alertText} />
    </ThemeProvider>
  );
}

export default App;
