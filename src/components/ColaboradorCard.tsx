import { Avatar, Box, IconButton, Paper, Typography } from "@mui/material"
import { StatusChip } from "./StatusChip"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

type Props = {
  nome: string
  email: string
  departamento: string
  status: "Ativo" | "Inativo"
  onEdit: () => void
  onDelete: () => void
}

export function ColaboradorCard(props: Props) {
  const { nome, email, departamento, status, onEdit, onDelete } = props

  return (
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={1}>
        <Avatar src={`https://i.pravatar.cc/150?u=${email}`} />
        <Typography fontWeight="bold">{nome}</Typography>
      </Box>

      <Typography variant="body2">{email}</Typography>
      <Typography variant="body2">{departamento}</Typography>

      <Box mt={1}>
        <StatusChip status={status} />

        <Box>
          <IconButton onClick={onEdit} size="small" color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={onDelete} size="small" color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}
