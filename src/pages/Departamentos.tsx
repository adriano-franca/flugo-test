import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
import { useDepartamentos, type Departamento } from "../hooks/useDepartamentos"
import { useColaboradores } from "../hooks/useColaboradores"

export function Departamentos() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  
  const { departamentos, loading: loadingDeps, removerDepartamento, editarDepartamento } = useDepartamentos()
  const { colaboradores } = useColaboradores()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingDepartamento, setEditingDepartamento] = useState<Departamento | null>(null)

  const gestoresDisponiveis = useMemo(() => {
    return colaboradores.filter(c => c.nivel === "Gestor")
  }, [colaboradores])

  const getNomeColaborador = (id: string) => {
    const colab = colaboradores.find(c => c.id === id)
    return colab ? colab.nome : "Desconhecido"
  }

  const getAvatarColaborador = (id: string) => {
    const colab = colaboradores.find(c => c.id === id)
    return colab ? colab.email : ""
  }

  const handleOpenDelete = (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await removerDepartamento(itemToDelete)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleOpenEdit = (dept: Departamento) => {
    setEditingDepartamento({ ...dept })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (editingDepartamento && editingDepartamento.id) {
      await editarDepartamento(editingDepartamento.id, {
        nome: editingDepartamento.nome,
        gestorId: editingDepartamento.gestorId,
      })
      setEditDialogOpen(false)
      setEditingDepartamento(null)
    }
  }

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
        <Typography variant="h5">Departamentos</Typography>

        <Button
          variant="contained"
          color="primary"
          disableElevation
          fullWidth={isMobile}
          sx={{ height: 40, px: 3 }}
          onClick={() => navigate("/departamentos/novo")}
        >
          Novo Departamento
        </Button>
      </Box>

      {loadingDeps && <Typography>Carregando...</Typography>}

      {!loadingDeps && (
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Gestor Responsável</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Colaboradores</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {departamentos.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">Nenhum departamento cadastrado.</Typography>
                    </TableCell>
                </TableRow>
              ) : (
                departamentos.map((dept) => (
                  <TableRow key={dept.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>
                      <Typography fontWeight={500}>{dept.nome}</Typography>
                    </TableCell>
                    <TableCell>
                        {dept.gestorId ? (
                            <Chip 
                                avatar={<Avatar src={`https://i.pravatar.cc/150?u=${getAvatarColaborador(dept.gestorId)}`} />}
                                label={getNomeColaborador(dept.gestorId)}
                                variant="outlined"
                            />
                        ) : (
                            <Typography color="text.secondary" variant="body2">-</Typography>
                        )}
                    </TableCell>
                    <TableCell>
                        <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                            {dept.colaboradoresIds?.map(colabId => (
                                <Tooltip key={colabId} title={getNomeColaborador(colabId)}>
                                    <Avatar 
                                        sx={{ width: 30, height: 30 }}
                                        src={`https://i.pravatar.cc/150?u=${getAvatarColaborador(colabId)}`} 
                                    />
                                </Tooltip>
                            ))}
                        </AvatarGroup>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end" spacing={1}>
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => handleOpenEdit(dept)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleOpenDelete(dept.id!)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja remover este departamento?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Excluir</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Departamento</DialogTitle>
        <DialogContent>
          {editingDepartamento && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField 
                label="Nome do Departamento" 
                fullWidth 
                value={editingDepartamento.nome} 
                onChange={(e) => setEditingDepartamento({...editingDepartamento, nome: e.target.value})}
              />
              
              <FormControl fullWidth>
                <InputLabel>Gestor Responsável</InputLabel>
                <Select
                    label="Gestor Responsável"
                    value={editingDepartamento.gestorId || ""}
                    onChange={(e) => setEditingDepartamento({...editingDepartamento, gestorId: e.target.value})}
                >
                    <MenuItem value="">Nenhum</MenuItem>
                    {gestoresDisponiveis.map(g => (
                        <MenuItem key={g.id} value={g.id}>{g.nome}</MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Colaboradores vinculados (somente leitura):
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, minHeight: 60, bgcolor: "#F9FAFB" }}>
                  {(!editingDepartamento.colaboradoresIds || editingDepartamento.colaboradoresIds.length === 0) ? (
                    <Typography variant="caption" color="text.secondary">
                      Nenhum colaborador neste departamento.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {editingDepartamento.colaboradoresIds.map((colabId) => (
                        <Chip 
                          key={colabId} 
                          label={getNomeColaborador(colabId)} 
                          size="small" 
                          sx={{ bgcolor: "#FFFFFF", border: "1px solid #E5E7EB" }}
                        />
                      ))}
                    </Box>
                  )}
                </Paper>
              </Box>
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