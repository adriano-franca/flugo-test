import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Step,
  StepConnector,
  StepContent,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
  stepConnectorClasses,
  styled,
  useTheme,
  InputAdornment,
} from "@mui/material"
import Check from "@mui/icons-material/Check"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { useColaboradores, type Colaborador } from "../hooks/useColaboradores"
import { useDepartamentos } from "../hooks/useDepartamentos"

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
    minHeight: 24,
    marginLeft: 15,
    borderLeftWidth: 2,
    borderLeftStyle: 'solid'
  },
}))

function CustomStepIcon(props: { active?: boolean; completed?: boolean; icon: React.ReactNode }) {
  const { active, completed, icon } = props
  
  return (
    <Box
      sx={{
        zIndex: 1,
        color: '#fff',
        width: 32,
        height: 32,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        bgcolor: active || completed ? 'primary.main' : '#E5E7EB',
      }}
    >
      {completed ? <Check sx={{ fontSize: 18 }} /> : icon}
    </Box>
  )
}

export function NovoColaborador() {
  const navigate = useNavigate()
  const theme = useTheme()
  
  const { adicionarColaborador, colaboradores } = useColaboradores()
  const { departamentos } = useDepartamentos()

  const [activeStep, setActiveStep] = useState(0)
  const [salvando, setSalvando] = useState(false)
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    ativo: true,
    departamento: "",
    cargo: "",
    dataAdmissao: "",
    nivel: "" as Colaborador["nivel"],
    gestorId: "",
    salario: ""
  })

  const [errors, setErrors] = useState({
    nome: false,
    email: false,
    departamento: false,
    cargo: false,
    dataAdmissao: false,
    nivel: false,
    salario: false
  })

  const gestoresDisponiveis = useMemo(() => {
    return colaboradores.filter(c => c.nivel === "Gestor")
  }, [colaboradores])

  const steps = [
    { label: "Infos Básicas" },
    { label: "Infos Profissionais" },
  ]

  const validateStep = () => {
    let isValid = true
    const newErrors = { ...errors }

    if (activeStep === 0) {
      if (!formData.nome.trim()) {
        newErrors.nome = true
        isValid = false
      } else newErrors.nome = false

      if (!formData.email.trim()) {
        newErrors.email = true
        isValid = false
      } else newErrors.email = false
    } else if (activeStep === 1) {
      if (!formData.departamento) {
        newErrors.departamento = true
        isValid = false
      } else newErrors.departamento = false

      if (!formData.cargo.trim()) {
        newErrors.cargo = true
        isValid = false
      } else newErrors.cargo = false

      if (!formData.dataAdmissao) {
        newErrors.dataAdmissao = true
        isValid = false
      } else newErrors.dataAdmissao = false

      if (!formData.nivel) {
        newErrors.nivel = true
        isValid = false
      } else newErrors.nivel = false

      if (!formData.salario.trim()) {
        newErrors.salario = true
        isValid = false
      } else newErrors.salario = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = async () => {
    if (!validateStep()) return

    if (activeStep === steps.length - 1) {
      setSalvando(true)
      
      const sucesso = await adicionarColaborador({
        ...formData,
        gestorId: formData.gestorId || undefined
      })

      setSalvando(false)

      if (sucesso) {
        navigate("/colaboradores")
      } else {
        alert("Erro ao salvar colaborador. Tente novamente.")
      }

    } else {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (activeStep === 0) {
      navigate("/colaboradores")
    } else {
      setActiveStep((prev) => prev - 1)
    }
  }

  const progressValue = activeStep === 0 ? 0 : 50

  return (
    <Box flex={1} p={{ xs: 2, md: 4 }} bgcolor="background.default" minHeight="100vh">
      <Header />

      <Box mb={1}>
        <Typography variant="body2" color="text.secondary">
          <span 
            style={{ fontWeight: 600, color: theme.palette.text.primary, cursor: 'pointer' }} 
            onClick={() => navigate('/colaboradores')}
          >
            Colaboradores
          </span>
          {" • "}
          <span style={{ color: theme.palette.primary.main }}>Cadastrar Colaborador</span>
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <LinearProgress 
          variant="determinate" 
          value={progressValue} 
          sx={{ 
            flex: 1, 
            height: 6, 
            borderRadius: 5,
            bgcolor: "#E5E7EB",
            "& .MuiLinearProgress-bar": {
              borderRadius: 5,
            }
          }} 
        />
        <Typography variant="caption" color="text.secondary" fontWeight="bold">
          {progressValue}%
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Stepper 
            activeStep={activeStep} 
            orientation="vertical" 
            connector={<CustomConnector />}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={(props) => (
                    <CustomStepIcon {...props} icon={index + 1} />
                  )}
                >
                  <Typography fontWeight={activeStep === index ? "bold" : "normal"} color={activeStep === index ? "text.primary" : "text.secondary"}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent sx={{ borderLeft: '2px solid #E5E7EB', ml: '15px', mt: 0, pl: 0 }} /> 
              </Step>
            ))}
          </Stepper>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 0, 
              border: 'none', 
              background: 'transparent',
              boxShadow: 'none'
            }}
          >
            
            <Typography variant="h5" fontWeight="bold" mb={4}>
               {activeStep === 0 ? "Informações Básicas" : "Informações Profissionais"}
            </Typography>

            {activeStep === 0 && (
              <Stack spacing={3} maxWidth={600}>
                <TextField
                  label="Nome"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.nome}
                  onChange={(e) => {
                    setFormData({...formData, nome: e.target.value})
                    if(errors.nome) setErrors({...errors, nome: false})
                  }}
                  error={errors.nome}
                  helperText={errors.nome ? "O nome é obrigatório" : ""}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                
                <TextField
                  label="E-mail"
                  placeholder="e.g. john@gmail.com"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value})
                    if(errors.email) setErrors({...errors, email: false})
                  }}
                  error={errors.email}
                  helperText={errors.email ? "O e-mail é obrigatório" : ""}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />

                <FormControlLabel
                  control={
                    <Switch 
                      checked={formData.ativo} 
                      onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                      color="primary" 
                    />
                  }
                  label={<Typography fontWeight={500} color="text.secondary">Ativar ao criar</Typography>}
                />
              </Stack>
            )}

            {activeStep === 1 && (
              <Stack spacing={3} maxWidth={600}>
                <TextField
                  label="Cargo"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.cargo}
                  onChange={(e) => {
                    setFormData({...formData, cargo: e.target.value})
                    if(errors.cargo) setErrors({...errors, cargo: false})
                  }}
                  error={errors.cargo}
                  helperText={errors.cargo ? "O cargo é obrigatório" : ""}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <FormControl fullWidth error={errors.departamento} required>
                      <Select
                          displayEmpty
                          value={formData.departamento}
                          onChange={(e) => {
                              setFormData({...formData, departamento: e.target.value})
                              if(errors.departamento) setErrors({...errors, departamento: false})
                          }}
                          sx={{ borderRadius: 2 }}
                          renderValue={(selected) => {
                              if (selected.length === 0) return <Typography color="text.secondary">Departamento</Typography>;
                              return selected;
                          }}
                      >
                          {departamentos.map((dept) => (
                              <MenuItem key={dept.id} value={dept.nome}>
                                  {dept.nome}
                              </MenuItem>
                          ))}
                          {departamentos.length === 0 && (
                             <MenuItem disabled value="">Nenhum departamento cadastrado</MenuItem>
                          )}
                      </Select>
                      {errors.departamento && <FormHelperText>Selecione um departamento</FormHelperText>}
                  </FormControl>

                  <FormControl fullWidth error={errors.nivel} required>
                      <Select
                          displayEmpty
                          value={formData.nivel}
                          onChange={(e) => {
                              setFormData({...formData, nivel: e.target.value as any})
                              if(errors.nivel) setErrors({...errors, nivel: false})
                          }}
                          sx={{ borderRadius: 2 }}
                          renderValue={(selected) => {
                              if (selected.length === 0) return <Typography color="text.secondary">Nível Hierárquico</Typography>;
                              return selected;
                          }}
                      >
                          <MenuItem value="Júnior">Júnior</MenuItem>
                          <MenuItem value="Pleno">Pleno</MenuItem>
                          <MenuItem value="Sênior">Sênior</MenuItem>
                          <MenuItem value="Gestor">Gestor</MenuItem>
                      </Select>
                      {errors.nivel && <FormHelperText>Selecione um nível</FormHelperText>}
                  </FormControl>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Data de Admissão"
                    type="date"
                    variant="outlined"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    value={formData.dataAdmissao}
                    onChange={(e) => {
                      setFormData({...formData, dataAdmissao: e.target.value})
                      if(errors.dataAdmissao) setErrors({...errors, dataAdmissao: false})
                    }}
                    error={errors.dataAdmissao}
                    helperText={errors.dataAdmissao ? "Data obrigatória" : ""}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />

                  <TextField
                    label="Salário Base"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.salario}
                    onChange={(e) => {
                      setFormData({...formData, salario: e.target.value})
                      if(errors.salario) setErrors({...errors, salario: false})
                    }}
                    error={errors.salario}
                    helperText={errors.salario ? "Salário obrigatório" : ""}
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        }
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Stack>

                <FormControl fullWidth>
                    <Select
                        displayEmpty
                        value={formData.gestorId}
                        onChange={(e) => setFormData({...formData, gestorId: e.target.value})}
                        sx={{ borderRadius: 2 }}
                        renderValue={(selected) => {
                            if (selected.length === 0) return <Typography color="text.secondary">Gestor Responsável (Opcional)</Typography>;
                            const gestor = gestoresDisponiveis.find(g => g.id === selected);
                            return gestor ? `${gestor.nome} - ${gestor.departamento}` : selected;
                        }}
                    >
                        <MenuItem value="">
                          <Typography color="text.secondary">Nenhum</Typography>
                        </MenuItem>
                        {gestoresDisponiveis.map(g => (
                          <MenuItem key={g.id} value={g.id}>{g.nome} - {g.departamento}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

              </Stack>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" maxWidth={600} mt={8}>
                <Button 
                    onClick={handleBack}
                    disabled={salvando}
                    sx={{ color: "text.secondary", fontWeight: "bold", textTransform: 'none' }}
                >
                    Voltar
                </Button>

                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleNext}
                    disabled={salvando}
                    sx={{ 
                        px: 4, 
                        py: 1, 
                        borderRadius: 2, 
                        fontWeight: "bold",
                        boxShadow: 'none'
                    }}
                >
                    {salvando ? "Salvando..." : (activeStep === steps.length - 1 ? "Concluir" : "Próximo")}
                </Button>
            </Box>

          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}