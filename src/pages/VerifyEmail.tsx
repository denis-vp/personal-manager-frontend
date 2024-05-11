import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import Container from "@mui/material/Container/Container";
import CssBaseline from "@mui/material/CssBaseline/CssBaseline";
import Typography from "@mui/material/Typography/Typography";
import { useNavigate } from "react-router-dom";
import AlertSnackBar from "../components/AlertSnackBar";
import { useState } from "react";

const MAIN_PAGE = "/dashboard";

function VerifyEmail() {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const resendEmail = () => {
    setAlertText("Email has been resent.");
    setOpenAlert(true);
  };

  const verifiedEmail = () => {
    navigate(MAIN_PAGE);
  };

  return (
    <>
      <Container component="main">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography align="center" variant="h5">
            An email has been sent to your email address.
          </Typography>
          <Typography align="center" variant="h5">
            Please verify your email address to continue.
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            marginTop={2}
            gap={3}
          >
            <Button variant="contained" onClick={resendEmail}>
              Resend email
            </Button>
            <Button variant="contained" onClick={verifiedEmail}>
              I have verified my email
            </Button>
          </Box>
        </Box>
      </Container>
      <AlertSnackBar open={openAlert} setOpen={setOpenAlert} text={alertText} />
    </>
  );
}

export default VerifyEmail;
