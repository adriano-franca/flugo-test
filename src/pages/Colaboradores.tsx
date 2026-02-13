import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
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
  
  const { colaboradores, loading, removerColaborador, editarColaborador } = useColaboradores()

  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState<OrderableFields>('nome')

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingColaborador, setEditingColaborador] = useState<Colaborador | null>(null)

  const handleOpenDelete = (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await removerColaborador(itemToDelete)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleOpenEdit = (colaborador: Colaborador) => {
    setEditingColaborador({ ...colaborador })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (editingColaborador && editingColaborador.id) {
      await editarColaborador(editingColaborador.id, {
        nome: editingColaborador.nome,
        email: editingColaborador.email,
        departamento: editingColaborador.departamento,
        status: editingColaborador.status
      })
      setEditDialogOpen(false)
      setEditingColaborador(null)
    }
  }

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
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Ações
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
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleOpenEdit(col)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleOpenDelete(col.id!)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
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
                onEdit={() => handleOpenEdit(col)}
                onDelete={() => handleOpenDelete(col.id!)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja remover este colaborador? Essa ação não pode ser desfeita.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Excluir</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Colaborador</DialogTitle>
        <DialogContent>
          {editingColaborador && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField 
                label="Nome" 
                fullWidth 
                value={editingColaborador.nome} 
                onChange={(e) => setEditingColaborador({...editingColaborador, nome: e.target.value})}
              />
              <TextField 
                label="Email" 
                fullWidth 
                value={editingColaborador.email} 
                onChange={(e) => setEditingColaborador({...editingColaborador, email: e.target.value})}
              />
              <TextField
                select
                label="Departamento"
                fullWidth
                value={editingColaborador.departamento}
                onChange={(e) => setEditingColaborador({...editingColaborador, departamento: e.target.value})}
              >
                <MenuItem value="TI">TI</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Produto">Produto</MenuItem>
              </TextField>
              <TextField
                select
                label="Status"
                fullWidth
                value={editingColaborador.status}
                onChange={(e) => setEditingColaborador({...editingColaborador, status: e.target.value})}
              >
                <MenuItem value="Ativo">Ativo</MenuItem>
                <MenuItem value="Inativo">Inativo</MenuItem>
              </TextField>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}