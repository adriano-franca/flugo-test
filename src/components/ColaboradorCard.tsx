import { Avatar, Box, Checkbox, IconButton, Paper, Typography } from "@mui/material"
import { StatusChip } from "./StatusChip"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

type Props = {
  nome: string
  email: string
  departamento: string
  status: "Ativo" | "Inativo"
  selected: boolean
  onToggleSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ColaboradorCard(props: Props) {
  const { nome, email, departamento, status, selected, onToggleSelect, onEdit, onDelete } = props

  return (
    <Paper 
      sx={{ 
        p: 2, 
        borderRadius: 3, 
        position: 'relative',
        border: selected ? '1px solid' : '1px solid #E5E7EB',
        borderColor: selected ? 'primary.main' : 'inherit',
        bgcolor: selected ? 'action.hover' : 'background.paper'
      }}
    >
      <Box position="absolute" top={8} right={8}>
        <Checkbox 
          checked={selected} 
          onChange={onToggleSelect} 
          size="small" 
        />
      </Box>

      <Box display="flex" alignItems="center" gap={2} mb={1} pr={4}>
        <Avatar src={`https://i.pravatar.cc/150?u=${email}`} />
        <Box>
          <Typography fontWeight="bold">{nome}</Typography>
          <Typography variant="body2" color="text.secondary">{departamento}</Typography>
        </Box>
      </Box>

      <Typography variant="body2" mb={1}>{email}</Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <StatusChip status={status} />
        
        <Box>
          <IconButton size="small" onClick={onEdit} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton size="small" onClick={onDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}