import { Box } from "@mui/material"
import { Routes, Route, Navigate } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"
import { Colaboradores } from "./pages/Colaboradores"
import { NovoColaborador } from "./pages/NovoColaborador"

function App() {
  return (
    <Box display="flex">
      <Sidebar />

      <Routes>
        <Route path="/" element={<Navigate to="/colaboradores" />} />
        
        <Route path="/colaboradores" element={<Colaboradores />} />

        <Route path="/colaboradores/novo" element={<NovoColaborador />} />
      </Routes>
    </Box>
  )
}

export default App