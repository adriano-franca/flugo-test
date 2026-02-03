import { Avatar, Box, Typography } from "@mui/material"

export function Header() {
  return (
    <Box display="flex" justifyContent="flex-end" mb={2}>
      <Avatar src="https://i.pravatar.cc/150" />
    </Box>
  )
}