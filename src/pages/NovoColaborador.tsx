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
} from "@mui/material"
import Check from "@mui/icons-material/Check"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"

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

  const [activeStep, setActiveStep] = useState(0)
  
  const [formData, setFormData] = useState({
    nome: "João da Silva",
    email: "",
    ativo: true,
    departamento: "",
  })

  const [errors, setErrors] = useState({
    nome: false,
    email: false,
    departamento: false
  })

  const steps = [
    { label: "Infos Básicas" },
    { label: "Infos Profissionais" },
  ]

  const validateStep = () => {
    let isValid = true
    const newErrors = { nome: false, email: false, departamento: false }

    if (activeStep === 0) {
      if (!formData.nome.trim()) {
        newErrors.nome = true
        isValid = false
      }
      if (!formData.email.trim()) {
        newErrors.email = true
        isValid = false
      }
    } else if (activeStep === 1) {
      if (!formData.departamento) {
        newErrors.departamento = true
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (!validateStep()) return

    if (activeStep === steps.length - 1) {
      console.log("Dados finais:", formData)
      navigate("/colaboradores")
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
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2 }
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2 }
                  }}
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
                            if (selected.length === 0) {
                            return <Typography color={errors.departamento ? "error" : "text.secondary"}>Selecione um departamento</Typography>;
                            }
                            return selected;
                        }}
                    >
                        <MenuItem value="TI">TI</MenuItem>
                        <MenuItem value="Design">Design</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                        <MenuItem value="Produto">Produto</MenuItem>
                    </Select>
                    {errors.departamento && <FormHelperText>Selecione uma opção</FormHelperText>}
                </FormControl>
              </Stack>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" maxWidth={600} mt={8}>
                <Button 
                    onClick={handleBack}
                    sx={{ color: "text.secondary", fontWeight: "bold", textTransform: 'none' }}
                >
                    Voltar
                </Button>

                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleNext}
                    sx={{ 
                        px: 4, 
                        py: 1, 
                        borderRadius: 2, 
                        fontWeight: "bold",
                        boxShadow: 'none'
                    }}
                >
                    {activeStep === steps.length - 1 ? "Concluir" : "Próximo"}
                </Button>
            </Box>

          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}