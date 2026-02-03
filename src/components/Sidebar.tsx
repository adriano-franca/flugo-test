import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import PeopleIcon from "@mui/icons-material/People"
import { useState } from "react"
import { useTheme, useMediaQuery } from "@mui/material"

export function Sidebar() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [open, setOpen] = useState(false)

  const content = (
    <Box sx={{ width: 240, p: 2 }}>
      <Typography variant="h6" fontWeight="bold" mb={4}>
        Flugo
      </Typography>

      <List>
        <ListItemButton selected>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Colaboradores" />
        </ListItemButton>
      </List>
    </Box>
  )

  if (isMobile) {
    return (
      <>
        <IconButton onClick={() => setOpen(true)} sx={{ position: "fixed", top: 16, left: 16 }}>
          <MenuIcon />
        </IconButton>

        <Drawer open={open} onClose={() => setOpen(false)}>
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
        borderRight: "1px solid #eee",
      }}
    >
      {content}
    </Box>
  )
}
