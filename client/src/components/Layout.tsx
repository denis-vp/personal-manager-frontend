import { AppBar, Box, Toolbar, Typography, styled } from "@mui/material";
import SideDrawer from "./SideDrawer";
import { format } from "date-fns";
import SearchBar from "./SearchBar";

const Page = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: theme.mixins.toolbar.minHeight,
}));

const drawerWidth = 220;

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
        <AppBar
          sx={{
            height: "57px",
            width: `calc(100% - ${drawerWidth}px)`,
            display: "flex",
            justifyContent: "center",
          }}
          elevation={0}
        >
          <Toolbar sx={{
            display: "flex",
            justifyContent: "space-between",
          }}>
            <Typography>
              Today is {format(new Date(), "MMMM do, yyyy")}
            </Typography>
            <SearchBar />
          </Toolbar>
        </AppBar>

      <SideDrawer drawerWidth={drawerWidth} />

      <Page sx={{maxWidth: `calc(100% - ${drawerWidth + 50}px)`}}>{children}</Page>
    </Box>
  );
}

export default Layout;
