import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from "../contexts/AuthContext";
import MenuIcon from "@mui/icons-material/Menu"
import PeopleIcon from "@mui/icons-material/People"
import BusinessIcon from "@mui/icons-material/Business"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth();
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [open, setOpen] = useState(false)

  const handleNavigate = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  const content = (
    <Box sx={{ width: 240, p: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={4} mt={1}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Flugo
        </Typography>
      </Box>

      <List>
        <ListItemButton
          selected={location.pathname.startsWith("/colaboradores")}
          onClick={() => handleNavigate("/colaboradores")}
          sx={{
            borderRadius: 2,
            mb: 1,
            "&.Mui-selected": {
              backgroundColor: "#DCFCE7",
              color: "primary.main",
              "&:hover": {
                backgroundColor: "#D1FAE5",
              },
              "& .MuiListItemIcon-root": {
                color: "primary.main",
              },
            },
          }}
        >
          <ListItemIcon>
            <PeopleIcon 
              color={location.pathname.startsWith("/colaboradores") ? "primary" : "inherit"} 
            />
          </ListItemIcon>
          <ListItemText 
            primary="Colaboradores" 
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItemButton>

        <ListItemButton
          selected={location.pathname.startsWith("/departamentos")}
          onClick={() => handleNavigate("/departamentos")}
          sx={{
            borderRadius: 2,
            mb: 1,
            "&.Mui-selected": {
              backgroundColor: "#DCFCE7",
              color: "primary.main",
              "&:hover": {
                backgroundColor: "#D1FAE5",
              },
              "& .MuiListItemIcon-root": {
                color: "primary.main",
              },
            },
          }}
        >
          <ListItemIcon>
            <BusinessIcon 
              color={location.pathname.startsWith("/departamentos") ? "primary" : "inherit"} 
            />
          </ListItemIcon>
          <ListItemText 
            primary="Departamentos" 
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItemButton>
      </List>
      <ListItemButton onClick={logout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Sair" />
      </ListItemButton>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton 
          onClick={() => setOpen(true)} 
          sx={{ position: "fixed", top: 12, left: 16, zIndex: 1200, bgcolor: 'background.default' }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer 
            open={open} 
            onClose={() => setOpen(false)}
            PaperProps={{ sx: { bgcolor: "background.default" } }}
        >
          {content}
        </Drawer>
      </>
    )
  }

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "background.default",
        flexShrink: 0,
      }}
    >
      {content}
    </Box>
  )
}