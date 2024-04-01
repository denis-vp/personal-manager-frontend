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
import CreateIcon from "@mui/icons-material/Create";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Stack from "@mui/material/Stack/Stack";
import Avatar from "@mui/material/Avatar/Avatar";
import Typography from "@mui/material/Typography/Typography";
import { deepPurple } from "@mui/material/colors";

const drawerWidth = 240;

const drawerButtons1 = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    text: "Tasks",
    icon: <TaskAltIcon />,
  },
  {
    text: "Notes",
    icon: <NotesIcon />,
  },
  {
    text: "Create",
    icon: <CreateIcon />,
  },
];

const drawerButtons2 = [
  {
    text: "Calendar",
    icon: <CalendarMonthIcon />,
  },
  {
    text: "Clock",
    icon: <AccessTimeIcon />,
  },
  {
    text: "Statistics",
    icon: <BarChartIcon />,
  },
];

const drawerButtons3 = [
  {
    text: "Settings",
    icon: <SettingsIcon />,
  },
];

function SideDrawer() {
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
      <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: 1 }}>
        <Avatar sx={{ bgcolor: deepPurple[500] }}>DP</Avatar>
        <Typography variant="h5">Denis Pop</Typography>
      </Stack>

      <Divider />

      <List>
        {drawerButtons1.map((button) => (
          <ListItem key={button.text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{button.icon}</ListItemIcon>
              <ListItemText primary={button.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {drawerButtons2.map((button) => (
          <ListItem key={button.text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{button.icon}</ListItemIcon>
              <ListItemText primary={button.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {drawerButtons3.map((button) => (
          <ListItem key={button.text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{button.icon}</ListItemIcon>
              <ListItemText primary={button.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default SideDrawer;
