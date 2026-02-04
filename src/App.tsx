import { Box } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Colaboradores } from "./pages/Colaboradores";
import { NovoColaborador } from "./pages/NovoColaborador";
import { Login } from "./pages/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { type ReactNode } from "react";

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Box display="flex">
      <Sidebar />
      {children}
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rota Pública (Login) */}
        <Route path="/login" element={<Login />} />

        {/* Rotas Privadas (Protegidas) */}
        <Route 
          path="/colaboradores" 
          element={
            <PrivateRoute>
              <Colaboradores />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/colaboradores/novo" 
          element={
            <PrivateRoute>
              <NovoColaborador />
            </PrivateRoute>
          } 
        />

        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/colaboradores" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;