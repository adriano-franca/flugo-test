import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { Header } from "../components/Header"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useNavigate } from "react-router-dom"

export function NovoColaborador() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Box flex={1} p={{ xs: 2, md: 4 }} bgcolor="background.default" minHeight="100vh">
      <Header />

      <Stack direction="row" alignItems="center" gap={2} mb={4}>
        <Button 
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />} 
            sx={{ color: "text.secondary" }}
        >
            Voltar
        </Button>
        <Typography variant="h5" fontWeight="bold">
          Novo Colaborador
        </Typography>
      </Stack>

      <Paper 
        elevation={0} 
        sx={{ 
            p: 4, 
            maxWidth: 800, 
            borderRadius: 2,
            mx: isMobile ? 0 : "auto"
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ mb: 1 }}>Dados Pessoais</Typography>
          
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Nome Completo" fullWidth required />
            <TextField label="Email Corporativo" type="email" fullWidth required />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Departamento</InputLabel>
              <Select label="Departamento" defaultValue="">
                <MenuItem value="ti">TI</MenuItem>
                <MenuItem value="design">Design</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="produto">Produto</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label="Status" defaultValue="ativo">
                <MenuItem value="ativo">Ativo</MenuItem>
                <MenuItem value="inativo">Inativo</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button variant="outlined" color="inherit" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" size="large">
              Salvar Cadastro
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}