import { Chip } from "@mui/material"

type Props = {
  status: "Ativo" | "Inativo"
}

export function StatusChip({ status }: Props) {
  const isActive = status === "Ativo"

  return (
    <Chip
      label={status}
      color={isActive ? "success" : "error"}
      variant="outlined"
      size="small"
    />
  )
}
