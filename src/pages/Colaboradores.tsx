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
  TableSortLabel,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { ColaboradorCard } from "../components/ColaboradorCard"
import { useColaboradores, type Colaborador } from "../hooks/useColaboradores"

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

type OrderableFields = keyof Pick<Colaborador, "nome" | "email" | "departamento" | "status">;

export function Colaboradores() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  
  const { colaboradores, loading } = useColaboradores()

  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState<OrderableFields>('nome')

  const handleRequestSort = (property: OrderableFields) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const colaboradoresOrdenados = useMemo(() => {
    return [...colaboradores].sort((a, b) => {
      const aValue = a[orderBy] || ""
      const bValue = b[orderBy] || ""

      if (order === 'asc') {
        return aValue.toString().localeCompare(bValue.toString())
      } else {
        return bValue.toString().localeCompare(aValue.toString())
      }
    })
  }, [colaboradores, order, orderBy])

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
                <TableCell sx={{ fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === 'nome'}
                    direction={orderBy === 'nome' ? order : 'asc'}
                    onClick={() => handleRequestSort('nome')}
                  >
                    Nome
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === 'email'}
                    direction={orderBy === 'email' ? order : 'asc'}
                    onClick={() => handleRequestSort('email')}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === 'departamento'}
                    direction={orderBy === 'departamento' ? order : 'asc'}
                    onClick={() => handleRequestSort('departamento')}
                  >
                    Departamento
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleRequestSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {colaboradoresOrdenados.map((col) => (
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
          {colaboradoresOrdenados.map((col) => (
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