import { 
  AppBar, 
  Avatar, 
  Box, 
  IconButton, 
  Toolbar, 
  Typography, 
  useMediaQuery, 
  useTheme 
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { usePerfil } from "../hooks/usePerfil"

export function Header() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { nome, foto, atualizarFoto } = usePerfil()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      atualizarFoto(event.target.files[0])
    }
  }

  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0} 
      sx={{ borderBottom: "1px solid #eee", bgcolor: "white", mb: 2 }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Box display="flex" alignItems="center" gap={2}>
          <Box textAlign="right" display={{ xs: "none", sm: "block" }}>
            <Typography variant="subtitle2" color="text.primary" fontWeight="bold">
              {nome}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Admin
            </Typography>
          </Box>

          <Box position="relative">
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload-local"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="avatar-upload-local">
              <IconButton component="span" sx={{ p: 0 }}>
                <Avatar 
                  src={foto} 
                  alt={nome}
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    cursor: "pointer", 
                    border: "2px solid white",
                    boxShadow: "0 0 0 2px #eee",
                    "&:hover": { opacity: 0.8 }
                  }} 
                />
              </IconButton>
            </label>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}