import { useState } from "react";

const STORAGE_KEY = "avatar_admin_v1";

export function usePerfil() {
  const nome = "Administrador";

  const [foto, setFoto] = useState<string>(() => {
    const fotoSalva = localStorage.getItem(STORAGE_KEY);
    return fotoSalva || "";
  });

  const atualizarFoto = (arquivo: File) => {
    if (!arquivo) return;

    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFoto(base64String);
      localStorage.setItem(STORAGE_KEY, base64String);
    };

    reader.readAsDataURL(arquivo);
  };

  return { nome, foto, atualizarFoto };
}