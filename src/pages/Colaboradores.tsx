import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Header } from "../components/Header"
import { StatusChip } from "../components/StatusChip"
import { ColaboradorCard } from "../components/ColaboradorCard"

const colaboradores = [
  {
    nome: "Fernanda Torres",
    email: "fernandatorres@flugo.com",
    departamento: "Design",
    status: "Ativo",
  },
  {
    nome: "Joana D'Arc",
    email: "joanadarc@flugo.com",
    departamento: "TI",
    status: "Ativo",
  },
  {
    nome: "Mari Froes",
    email: "marifroes@flugo.com",
    departamento: "Marketing",
    status: "Ativo",
  },
  {
    nome: "Clara Costa",
    email: "claracosta@flugo.com",
    departamento: "Produto",
    status: "Inativo",
  },
] as const

export function Colaboradores() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Box flex={1} p={{ xs: 2, md: 4 }}>
      <Header />

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        gap={2}
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Colaboradores
        </Typography>

        <Button
          variant="contained"
          color="success"
          fullWidth={isMobile}
        >
          Novo Colaborador
        </Button>
      </Box>

      {!isMobile && (
        <Paper elevation={0} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Departamento</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {colaboradores.map((col) => (
                <TableRow key={col.email}>
                  <TableCell>{col.nome}</TableCell>
                  <TableCell>{col.email}</TableCell>
                  <TableCell>{col.departamento}</TableCell>
                  <TableCell>
                    <StatusChip status={col.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {isMobile && (
        <Grid container spacing={2}>
            {colaboradores.map((col) => (
                <Grid key={col.email} size={12}>
                   <ColaboradorCard {...col} />
                </Grid>
            ))}
        </Grid>
      )}
    </Box>
  )
}
