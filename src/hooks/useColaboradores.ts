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

  const findDepartamentoByName = async (nomeDepartamento: string) => {
    if (!nomeDepartamento) return null;
    const q = query(collection(db, "departamentos"), where("nome", "==", nomeDepartamento));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return {
        id: querySnapshot.docs[0].id,
        data: querySnapshot.docs[0].data()
      };
    }
    return null;
  };

  const adicionarColaborador = async (dados: Omit<Colaborador, 'id' | 'createdAt' | 'status'> & { ativo: boolean }) => {
    try {
      const batch = writeBatch(db);
      
      const novoColaboradorRef = doc(collection(db, "colaboradores"));
      
      let finalGestorId = dados.gestorId || "";
      const departamentoInfo = await findDepartamentoByName(dados.departamento);

      if (departamentoInfo) {
        const gestorDoDepartamento = departamentoInfo.data.gestorId;
        if (novoColaboradorRef.id === gestorDoDepartamento) {
          finalGestorId = "";
        } else if (gestorDoDepartamento) {
          finalGestorId = gestorDoDepartamento;
        }

        const departamentoRef = doc(db, "departamentos", departamentoInfo.id);
        batch.update(departamentoRef, {
          colaboradoresIds: arrayUnion(novoColaboradorRef.id)
        });
      }

      batch.set(novoColaboradorRef, {
        ...dados,
        gestorId: finalGestorId,
        status: dados.ativo ? "Ativo" : "Inativo", 
        createdAt: Timestamp.now()
      });

      await batch.commit();
      return true;
    } catch (error) {
      console.error("Erro ao salvar:", error);
      return false;
    }
  };

  const removerColaborador = async (id: string) => {
    try {
      const colaboradorRef = doc(db, "colaboradores", id);
      const colaboradorSnap = await getDoc(colaboradorRef);
      
      const batch = writeBatch(db);

      if (colaboradorSnap.exists()) {
        const dados = colaboradorSnap.data() as Colaborador;
        const departamentoInfo = await findDepartamentoByName(dados.departamento);
        
        if (departamentoInfo) {
            const departamentoRef = doc(db, "departamentos", departamentoInfo.id);
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
      const dadosParaAtualizar = { ...novosDados };

      if (novosDados.departamento && novosDados.departamento !== dadosAtuais.departamento) {
        
        const deptAntigoInfo = await findDepartamentoByName(dadosAtuais.departamento);
        if (deptAntigoInfo) {
          const deptAntigoRef = doc(db, "departamentos", deptAntigoInfo.id);
          batch.update(deptAntigoRef, {
            colaboradoresIds: arrayRemove(id)
          });
        }

        const deptNovoInfo = await findDepartamentoByName(novosDados.departamento);
        if (deptNovoInfo) {
          const deptNovoRef = doc(db, "departamentos", deptNovoInfo.id);
          batch.update(deptNovoRef, {
            colaboradoresIds: arrayUnion(id)
          });

          const novoGestorId = deptNovoInfo.data.gestorId;
          dadosParaAtualizar.gestorId = (id === novoGestorId) ? "" : (novoGestorId || "");
        } else {
           dadosParaAtualizar.gestorId = "";
        }
      }

      batch.update(colaboradorRef, dadosParaAtualizar);

      await batch.commit();
      return true;
    } catch (error) {
      console.error("Erro ao editar:", error);
      return false;
    }
  };

  return { colaboradores, loading, adicionarColaborador, removerColaborador, removerVariosColaboradores, editarColaborador };
}