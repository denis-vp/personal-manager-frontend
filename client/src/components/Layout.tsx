import { Box, styled } from "@mui/material";
import SideDrawer from "./SideDrawer";

const Page = styled("div")({
  width: "100%",
});

const drawerWidth = 220;

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: "flex" }}>
      <SideDrawer drawerWidth={drawerWidth} />

      <Page>{children}</Page>
    </Box>
  );
}

export default Layout;
