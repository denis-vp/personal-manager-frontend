import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Task } from "../../state/taskStore";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import TextField from "@mui/material/TextField/TextField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormControl from "@mui/material/FormControl/FormControl";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Select from "@mui/material/Select/Select";
import Stack from "@mui/material/Stack/Stack";
import FormControlLabel from "@mui/material/FormControlLabel/FormControlLabel";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import Button from "@mui/material/Button/Button";
import { validateTask } from "../../validators/taskValidator";
import { useSnackBarStore } from "../../state/snackBarStore";
import dayjs from "dayjs";
import { IconButton } from "@mui/material";

type TaskFormProps = {
  text: string;
  confirmText: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: (task: Task) => void;
  task?: Task;
};

function TaskForm({
  text,
  confirmText,
  open,
  setOpen,
  onConfirm,
  task,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const { setOpenAlert, setAlertText } = useSnackBarStore();

  useEffect(() => {
    if (task) {
      setTitle(task.title); 
      setCategory(task.category);
      setContent(task.content);
      setIsFinished(task.isFinished);
      setDueDate(task.dueDate);
      setPriority(task.priority);
    } else {
      setTitle("");
      setCategory("");
      setContent("");
      setIsFinished(false);
      setDueDate("");
      setPriority("");
    }
  }, [task]);

  const handleClose = () => {
    setTitle("");
    setCategory("");
    setContent("");
    setIsFinished(false);
    setDueDate("");
    setPriority("");
    setOpen(false);
  };

  const handleOnConfirm = (
    title: string,
    category: string,
    content: string,
    isFinished: boolean,
    dueDate: string | null,
    priority: string
  ) => {
    const newTask: Task = {
      id: task?.id || uuidv4(),
      title,
      category,
      content,
      isFinished,
      dueDate: dueDate !== "" ? dueDate : null,
      priority: priority,
    };
    if (validateTask(newTask)) {
      onConfirm(newTask);
      handleClose();
    } else {
      setAlertText("Invalid task");
      setOpenAlert(true);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{text}</DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (title && content) {
            handleOnConfirm(
              title,
              category,
              content,
              isFinished,
              dueDate,
              priority
            );
          }
        }}
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextField
            autoFocus
            margin="dense"
            label="Category"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>

          <Stack
            direction="row"
            spacing={2}
            style={{
              marginTop: "0.5em",
              marginBottom: "0.5em",
              display: "flex",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date"
                value={dueDate ? dayjs(dueDate) : null}
                onChange={(val) => setDueDate(val?.format("MM-DD-YYYY") || "")}
                format="MM-DD-YYYY"
              />
            </LocalizationProvider>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setDueDate("")}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <div
              style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              <FormControlLabel
                autoFocus
                label="Finished"
                control={
                  <Checkbox
                    checked={isFinished}
                    onChange={(e) => setIsFinished(e.target.checked)}
                  />
                }
              />
            </div>
          </Stack>

          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">{confirmText}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TaskForm;
