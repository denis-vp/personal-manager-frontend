import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSnackBarStore } from "../state/snackBarStore";
import { useApiStore } from "../state/apiStore";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import { DialogActions } from "@mui/material";
import { useUserStore } from "../state/userStore";

const SIGN_UP = "/sign-up";
const MAIN_PAGE = "/dashboard";

function SignIn() {
  const navigate = useNavigate();
  const { setUser, setAccessToken, setIsConnected } = useUserStore();
  const { auth } = useApiStore();
  const { setOpenAlert, setAlertText } = useSnackBarStore();

  const [openVerify, setOpenVerify] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = async (
    email: string,
    password: string,
    code: string
  ) => {
    auth(email, password, code)
      .then((response) => {
        if (response.status === 200) {
          setAlertText("Verification code sent to your email");
          setOpenAlert(true);
          setOpenVerify(true);
        } else if (response.status === 201) {
          setAlertText("Logged in successfully");
          setOpenAlert(true);
          navigate(MAIN_PAGE);

          setUser(response.data.user);
          setAccessToken(response.data.accessToken);
          setIsConnected(true);
        } else {
          setAlertText("Error logging in");
          setOpenAlert(true);
        }
      })
      .catch((error) => {
        if (!error.response) {
          setAlertText("Network error");
          setOpenAlert(true);
          return;
        }
        
        if (error.response.status === 400) {
          setAlertText("Verification code sent to your email");
          setOpenAlert(true);
          setOpenVerify(true);
          return;
        }

        setAlertText("Error logging in: " + error.response.data.message);
        setOpenAlert(true);
      });
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (email && password) {
                handleSubmit(email, password, code);
              }
            }}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => navigate(SIGN_UP)}
                >
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Dialog open={openVerify}>
        <DialogTitle>Enter the code sent to your email</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (code) {
              handleSubmit(email, password, code);
              setOpenVerify(false);
            }
          }}
        >
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Code"
              fullWidth
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenVerify(false);
                setCode("");
                setEmail("");
                setPassword("");
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default SignIn;
