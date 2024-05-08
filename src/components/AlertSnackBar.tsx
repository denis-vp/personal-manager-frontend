import IconButton from "@mui/material/IconButton/IconButton";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import CloseIcon from "@mui/icons-material/Close";

type AlertSnackBarProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  text: string;
};

function AlertSnackBar({ open, setOpen, text }: AlertSnackBarProps) {
  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={text}
      action={action}
    />
  );
}

export default AlertSnackBar;
