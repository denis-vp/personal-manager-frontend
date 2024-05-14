import { Typography } from "@mui/material";
import Box from "@mui/material/Box/Box";
import Container from "@mui/material/Container/Container";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApiStore } from "../state/apiStore";
import { useSnackBarStore } from "../state/snackBarStore";

const SIGN_IN = "/sign-in";

function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyUser } = useApiStore();
  const { setOpenAlert, setAlertText } = useSnackBarStore();

  useEffect(() => {
    const queryParameters = new URLSearchParams(location.search);
    const token = queryParameters.get("code");
    verifyUser(token as string)
      .then((response) => {
        if (response.status === 201) {
          setAlertText("Email verified successfully");
          setOpenAlert(true);
          setTimeout(() => navigate(SIGN_IN), 2000);
        } else {
          setAlertText("Error verifying email");
          setOpenAlert(true);
        }
      })
      .catch((error) => {
        if (!error.response) {
          setAlertText("Network error");
          setOpenAlert(true);
          return;
        }

        setAlertText("Error verifying email: " + error.response.data.message);
        setOpenAlert(true);
      });
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignContent="center"
      height="100vh"
    >
      <Container>
        <Typography variant="h4">Email Verification</Typography>
        <Typography>Verifying email, please wait...</Typography>
      </Container>
    </Box>
  );
}

export default EmailVerification;
