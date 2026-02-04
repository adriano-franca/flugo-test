import { useState } from "react";

const STORAGE_KEY = "avatar_admin_v1";

export function usePerfil() {
  const nome = "Administrador";

  const [foto] = useState<string>(() => {
    const fotoSalva = localStorage.getItem(STORAGE_KEY);
    if (fotoSalva) return fotoSalva;

    const randomId = Math.floor(Math.random() * 1000000);
    const randomUrl = `https://i.pravatar.cc/150?u=${randomId}`;
    
    localStorage.setItem(STORAGE_KEY, randomUrl);
    
    return randomUrl;
  });

  return { nome, foto };
}