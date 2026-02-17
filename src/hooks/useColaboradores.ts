import { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  deleteDoc,
  updateDoc,
  doc,
  writeBatch,
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { db } from "../services/firebase";

export type Colaborador = {
  id?: string;
  nome: string;
  email: string;
  departamento: string;
  cargo: string;
  dataAdmissao: string;
  nivel: "Júnior" | "Pleno" | "Sênior" | "Gestor";
  gestorId?: string;
  salario: string;
  status: string;
  ativo?: boolean;
  createdAt?: Timestamp;
};

export function useColaboradores() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "colaboradores"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Colaborador[];
      
      setColaboradores(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const adicionarColaborador = async (dados: Omit<Colaborador, 'id' | 'createdAt' | 'status'> & { ativo: boolean }) => {
    try {
      await addDoc(collection(db, "colaboradores"), {
        ...dados,
        status: dados.ativo ? "Ativo" : "Inativo", 
        createdAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error("Erro ao salvar:", error);
      return false;
    }
  };

  const removerColaborador = async (id: string) => {
    try {
      const docRef = doc(db, "colaboradores", id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Erro ao excluir:", error);
      return false;
    }
  };

  const removerVariosColaboradores = async (ids: string[]) => {
    try {
      const selecionados = writeBatch(db);
      ids.forEach(id => {
        const docRef = doc(db, "colaboradores", id);
        selecionados.delete(docRef);
      });
      await selecionados.commit();
      return true;
    }catch (error) {
      console.error("Erro ao excluir vários:", error);
      return false;
    }
  };

  const editarColaborador = async (id: string, dados: Partial<Colaborador>) => {
    try {
      const docRef = doc(db, "colaboradores", id);
      await updateDoc(docRef, dados);
      return true;
    } catch (error) {
      console.error("Erro ao editar:", error);
      return false;
    }
  };

  return { colaboradores, loading, adicionarColaborador, removerColaborador, removerVariosColaboradores, editarColaborador };
}