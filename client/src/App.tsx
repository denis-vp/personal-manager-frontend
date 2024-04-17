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
  const { openAlert, alertText, setOpenAlert } = useSnackBarStore();

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <AlertSnackBar open={openAlert} setOpen={setOpenAlert} text={alertText} />
    </ThemeProvider>
  );
}

export default App;
