import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { useDepartamentos } from "../hooks/useDepartamentos"
import { useColaboradores } from "../hooks/useColaboradores"

export function NovoDepartamento() {
  const navigate = useNavigate()
  const theme = useTheme()
  
  const { adicionarDepartamento } = useDepartamentos()
  const { colaboradores } = useColaboradores()

  const [salvando, setSalvando] = useState(false)
  
  const [formData, setFormData] = useState({
    nome: "",
    gestorId: "",
  })

  const [errors, setErrors] = useState({
    nome: false,
    gestor: false
  })

  const gestoresDisponiveis = useMemo(() => {
    return colaboradores.filter(c => c.nivel === "Gestor")
  }, [colaboradores])

  const handleSave = async () => {
    const newErrors = { 
        nome: !formData.nome.trim(),
        gestor: !formData.gestorId
    }
    
    setErrors(newErrors)

    if (newErrors.nome || newErrors.gestor) return

    setSalvando(true)
    
    const sucesso = await adicionarDepartamento({
        nome: formData.nome,
        gestorId: formData.gestorId,
        colaboradoresIds: []
    })

    setSalvando(false)

    if (sucesso) {
        navigate("/departamentos")
    } else {
        alert("Erro ao salvar departamento.")
    }
  }

  return (
    <Box flex={1} p={{ xs: 2, md: 4 }} bgcolor="background.default" minHeight="100vh">
      <Header />

      <Box mb={4}>
        <Typography variant="body2" color="text.secondary">
          <span 
            style={{ fontWeight: 600, color: theme.palette.text.primary, cursor: 'pointer' }} 
            onClick={() => navigate('/departamentos')}
          >
            Departamentos
          </span>
          {" • "}
          <span style={{ color: theme.palette.primary.main }}>Novo Departamento</span>
        </Typography>
      </Box>

      <Grid container justifyContent="center">
        <Grid size={{ xs: 12, md: 8, lg: 6 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #E5E7EB' }}>
            <Typography variant="h5" fontWeight="bold" mb={4}>
               Cadastrar Departamento
            </Typography>

            <Stack spacing={3}>
                <TextField
                  label="Nome do Departamento"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  error={errors.nome}
                  helperText={errors.nome ? "O nome é obrigatório" : ""}
                />

                <FormControl fullWidth error={errors.gestor} required>
                    <InputLabel>Gestor Responsável</InputLabel>
                    <Select
                        label="Gestor Responsável"
                        value={formData.gestorId}
                        onChange={(e) => setFormData({...formData, gestorId: e.target.value})}
                    >
                        {gestoresDisponiveis.map(g => (
                            <MenuItem key={g.id} value={g.id}>{g.nome}</MenuItem>
                        ))}
                    </Select>
                    {errors.gestor && <Typography variant="caption" color="error" sx={{ml: 2, mt: 0.5}}>Selecione um gestor</Typography>}
                </FormControl>
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    * Para adicionar colaboradores a este departamento, edite o cadastro individual de cada colaborador.
                </Typography>
            </Stack>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                <Button 
                    onClick={() => navigate('/departamentos')}
                    disabled={salvando}
                    sx={{ color: "text.secondary", fontWeight: "bold" }}
                >
                    Cancelar
                </Button>

                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleSave}
                    disabled={salvando}
                    sx={{ px: 4, fontWeight: "bold" }}
                >
                    {salvando ? "Salvando..." : "Salvar"}
                </Button>
            </Box>

          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}