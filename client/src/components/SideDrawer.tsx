import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import NotesIcon from "@mui/icons-material/Notes";
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Stack from "@mui/material/Stack/Stack";
import Avatar from "@mui/material/Avatar/Avatar";
import Typography from "@mui/material/Typography/Typography";
import { deepPurple } from "@mui/material/colors";
import { useNavigate, useLocation } from "react-router-dom";

const drawerItems1 = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/",
  },
  {
    text: "Tasks",
    icon: <TaskAltIcon />,
    path: "/tasks",
  },
  {
    text: "Notes",
    icon: <NotesIcon />,
    path: "/notes",
  },
  {
    text: "Expenses",
    icon: <AttachMoneyIcon />,
    path: "/expenses",
  },
  {
    text: "Events",
    icon: <EventIcon />,
    path: "/events",
  },
];

const drawerItems2 = [
  {
    text: "Calendar",
    icon: <CalendarMonthIcon />,
    path: "/calendar",
  },
  {
    text: "Clock",
    icon: <AccessTimeIcon />,
    path: "/clock",
  },
  {
    text: "Statistics",
    icon: <BarChartIcon />,
    path: "/statistics",
  },
];

const drawerItems3 = [
  {
    text: "Settings",
    icon: <SettingsIcon />,
    path: "/settings",
  },
];

const activeStyle = {
  bgcolor: "primary.main",
};

type SideDrawerProps = {
  drawerWidth: number;
}

function SideDrawer({drawerWidth} : SideDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          padding: 1,
          bgcolor: "white",
          position: "sticky",
          top: 0,
          zIndex: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Avatar sx={{ bgcolor: deepPurple[500] }}>DP</Avatar>
        <Typography variant="h5">Denis Pop</Typography>
      </Stack>

      <List>
        {drawerItems1.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={location.pathname === item.path ? activeStyle : null}
          >
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {drawerItems2.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={location.pathname === item.path ? activeStyle : null}
            disabled
          >
            <ListItemButton onClick={() => null}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {drawerItems3.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={location.pathname === item.path ? activeStyle : null}
            disabled
          >
            <ListItemButton onClick={() => null}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default SideDrawer;
