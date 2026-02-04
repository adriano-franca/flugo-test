import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { ColaboradorCard } from "../components/ColaboradorCard"
import { useColaboradores } from "../hooks/useColaboradores"

function CustomStatusChip({ status }: { status: string }) {
  const isActive = status === "Ativo"
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        fontWeight: "bold",
        borderRadius: "6px",
        backgroundColor: isActive ? "#DCFCE7" : "#FEE2E2",
        color: isActive ? "#166534" : "#991B1B",
        border: "none",
      }}
    />
  )
}

export function Colaboradores() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  
  const { colaboradores, loading } = useColaboradores()

  return (
    <Box flex={1} p={{ xs: 2, md: 4 }} bgcolor="background.default">
      <Header />

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        gap={2}
        mb={4}
      >
        <Typography variant="h5">Colaboradores</Typography>

        <Button
          variant="contained"
          color="primary"
          disableElevation
          fullWidth={isMobile}
          sx={{ height: 40, px: 3 }}
          onClick={() => navigate("/colaboradores/novo")}
        >
          Novo Colaborador
        </Button>
      </Box>

      {loading && <Typography>Carregando...</Typography>}

      {!loading && !isMobile && (
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
              <TableRow>
                <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>
                  <Box display="flex" alignItems="center" gap={0.5} sx={{ cursor: 'pointer' }}>
                    Nome <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                  </Box>
                </TableCell>
                <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>
                  <Box display="flex" alignItems="center" gap={0.5} sx={{ cursor: 'pointer' }}>
                    Email <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                  </Box>
                </TableCell>
                <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    Departamento <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                  </Box>
                </TableCell>
                <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    Status <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {colaboradores.map((col) => (
                <TableRow
                  key={col.id || col.email}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        src={`https://i.pravatar.cc/150?u=${col.email}`}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Typography variant="body2" fontWeight={500}>
                        {col.nome}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {col.email}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {col.departamento}
                  </TableCell>
                  <TableCell>
                    <CustomStatusChip status={col.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {!loading && isMobile && (
        <Grid container spacing={2}>
          {colaboradores.map((col) => (
            <Grid key={col.id || col.email} size={12}>
              <ColaboradorCard 
                nome={col.nome}
                email={col.email}
                departamento={col.departamento}
                status={col.status as "Ativo" | "Inativo"}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}