import { Box } from "@mui/material"
import { Sidebar } from "./components/SideBar"
import { Colaboradores } from "./pages/Colaboradores"

function App() {
  return (
    <Box display="flex">
      <Sidebar />
      <Colaboradores />
    </Box>
  )
}

export default App
