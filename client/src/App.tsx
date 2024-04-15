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
import { useNoteStore } from "./state/noteStore";
import { useEffect } from "react";

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
  const { loadData } = useNoteStore();
  const { openAlert, alertText, setOpenAlert, setAlertText } = useSnackBarStore();

  useEffect(() => {
    loadData(3, 5, setOpenAlert, setAlertText);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <AlertSnackBar open={openAlert} setOpen={setOpenAlert} text={alertText} />
    </ThemeProvider>
  );
}

export default App;
