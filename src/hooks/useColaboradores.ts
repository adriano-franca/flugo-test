import { useState, useEffect } from "react";
import { 
  collection,
  doc,
  writeBatch,
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp,
  getDoc,
  where,
  getDocs,
  arrayUnion,
  arrayRemove
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

  // Função auxiliar para encontrar departamento pelo nome
  const findDepartamentoIdByName = async (nomeDepartamento: string) => {
    if (!nomeDepartamento) return null;
    const q = query(collection(db, "departamentos"), where("nome", "==", nomeDepartamento));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }
    return null;
  };

  const adicionarColaborador = async (dados: Omit<Colaborador, 'id' | 'createdAt' | 'status'> & { ativo: boolean }) => {
    try {
      const batch = writeBatch(db);
      
      // 1. Cria a referência para o novo colaborador
      const novoColaboradorRef = doc(collection(db, "colaboradores"));
      
      batch.set(novoColaboradorRef, {
        ...dados,
        status: dados.ativo ? "Ativo" : "Inativo", 
        createdAt: Timestamp.now()
      });

      // 2. Tenta encontrar o departamento para vincular
      const departamentoId = await findDepartamentoIdByName(dados.departamento);
      if (departamentoId) {
        const departamentoRef = doc(db, "departamentos", departamentoId);
        batch.update(departamentoRef, {
          colaboradoresIds: arrayUnion(novoColaboradorRef.id)
        });
      }

      await batch.commit();
      return true;
    } catch (error) {
      console.error("Erro ao salvar:", error);
      return false;
    }
  };

  const removerColaborador = async (id: string) => {
    try {
      // Primeiro precisamos saber qual é o departamento dele para remover o ID de lá
      const colaboradorRef = doc(db, "colaboradores", id);
      const colaboradorSnap = await getDoc(colaboradorRef);
      
      const batch = writeBatch(db);

      if (colaboradorSnap.exists()) {
        const dados = colaboradorSnap.data() as Colaborador;
        const departamentoId = await findDepartamentoIdByName(dados.departamento);
        
        if (departamentoId) {
            const departamentoRef = doc(db, "departamentos", departamentoId);
            batch.update(departamentoRef, {
                colaboradoresIds: arrayRemove(id)
            });
        }
      }

      batch.delete(colaboradorRef);
      await batch.commit();
      return true;
    } catch (error) {
      console.error("Erro ao excluir:", error);
      return false;
    }
  };

  const removerVariosColaboradores = async (ids: string[]) => {
    try {
      const batch = writeBatch(db);
      
      // Para cada ID, precisamos fazer o processo de limpeza (simplificado aqui para delete direto, 
      // mas idealmente deveria limpar os departamentos também. Se for muito volume, melhor fazer cloud function)
      // Vou manter a deleção simples para não estourar limite de leituras em massa num loop
      ids.forEach(id => {
        const docRef = doc(db, "colaboradores", id);
        batch.delete(docRef);
      });
      
      await batch.commit();
      return true;
    }catch (error) {
      console.error("Erro ao excluir vários:", error);
      return false;
    }
  };

  const editarColaborador = async (id: string, novosDados: Partial<Colaborador>) => {
    try {
      const colaboradorRef = doc(db, "colaboradores", id);
      const colaboradorSnap = await getDoc(colaboradorRef);
      
      if (!colaboradorSnap.exists()) return false;

      const dadosAtuais = colaboradorSnap.data() as Colaborador;
      const batch = writeBatch(db);

      // Atualiza os dados do colaborador
      batch.update(colaboradorRef, novosDados);

      // Verifica se houve mudança de departamento
      if (novosDados.departamento && novosDados.departamento !== dadosAtuais.departamento) {
        // 1. Remove do departamento antigo
        const deptAntigoId = await findDepartamentoIdByName(dadosAtuais.departamento);
        if (deptAntigoId) {
          const deptAntigoRef = doc(db, "departamentos", deptAntigoId);
          batch.update(deptAntigoRef, {
            colaboradoresIds: arrayRemove(id)
          });
        }

        // 2. Adiciona no novo departamento
        const deptNovoId = await findDepartamentoIdByName(novosDados.departamento);
        if (deptNovoId) {
          const deptNovoRef = doc(db, "departamentos", deptNovoId);
          batch.update(deptNovoRef, {
            colaboradoresIds: arrayUnion(id)
          });
        }
      }

      await batch.commit();
      return true;
    } catch (error) {
      console.error("Erro ao editar:", error);
      return false;
    }
  };

  return { colaboradores, loading, adicionarColaborador, removerColaborador, removerVariosColaboradores, editarColaborador };
}