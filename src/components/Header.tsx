import { Avatar, Box } from "@mui/material"
import { useState } from "react"

export function Header() {
  const [avatar] = useState(() => {
    const key = "avatar_usuario_fixo"
    const salvo = localStorage.getItem(key)
    
    if (salvo) return salvo

    const novo = `https://i.pravatar.cc/150?u=${Math.floor(Math.random() * 1000000)}`
    localStorage.setItem(key, novo)
    return novo
  })

  return (
    <Box display="flex" justifyContent="flex-end" mb={2}>
      <Avatar src={avatar} alt="Foto do Usuário" />
    </Box>
  )
}