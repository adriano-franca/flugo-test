import { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  deleteDoc,
  doc,
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp,
  writeBatch,
  getDoc,
  where,
  getDocs,
  arrayRemove
} from "firebase/firestore";
import { db } from "../services/firebase";

export type Departamento = {
  id?: string;
  nome: string;
  gestorId: string;
  colaboradoresIds: string[];
  createdAt?: Timestamp;
};

export function useDepartamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "departamentos"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Departamento[];
      
      setDepartamentos(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const adicionarDepartamento = async (dados: Omit<Departamento, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, "departamentos"), {
        ...dados,
        createdAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error("Erro ao salvar departamento:", error);
      return false;
    }
  };

  const removerDepartamento = async (id: string) => {
    try {
      const docRef = doc(db, "departamentos", id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Erro ao excluir departamento:", error);
      return false;
    }
  };

  const findDepartamentoIdByName = async (nome: string) => {
    if (!nome) return null;
    const q = query(collection(db, "departamentos"), where("nome", "==", nome));
    const snap = await getDocs(q);
    if (!snap.empty) return snap.docs[0].id;
    return null;
  };

  const editarDepartamento = async (id: string, dados: Partial<Departamento>) => {
    try {
      const deptRef = doc(db, "departamentos", id);
      const deptSnap = await getDoc(deptRef);
      
      if (!deptSnap.exists()) return false;
      
      const currentData = deptSnap.data() as Departamento;
      const batch = writeBatch(db);

      batch.update(deptRef, dados);

      const novoNome = dados.nome || currentData.nome;
      const nomeMudou = dados.nome && dados.nome !== currentData.nome;

      const novoGestorId = dados.gestorId !== undefined ? dados.gestorId : currentData.gestorId;
      const gestorMudou = dados.gestorId !== undefined && dados.gestorId !== currentData.gestorId;

      const listaFinalIds = dados.colaboradoresIds || currentData.colaboradoresIds || [];
      const listaAntigaIds = currentData.colaboradoresIds || [];

      const removidosIds = listaAntigaIds.filter(uid => !listaFinalIds.includes(uid));

      const updatesMap = new Map<string, { [key: string]: any }>(); 

      const addUpdate = (uid: string, fields: { [key: string]: any }) => {
        const current = updatesMap.get(uid) || {};
        updatesMap.set(uid, { ...current, ...fields });
      };

      if (nomeMudou) {
        listaFinalIds.forEach(uid => addUpdate(uid, { departamento: novoNome }));
      } else {
        const adicionadosIds = listaFinalIds.filter(uid => !listaAntigaIds.includes(uid));
        adicionadosIds.forEach(uid => addUpdate(uid, { departamento: novoNome }));
      }

      removidosIds.forEach(uid => {
        addUpdate(uid, { departamento: "" });
      });

      if (gestorMudou) {
        listaFinalIds.forEach(uid => {
          const targetGestorId = (uid === novoGestorId) ? "" : novoGestorId;
          addUpdate(uid, { gestorId: targetGestorId });
        });
      }

      for (const [colabId, fields] of updatesMap.entries()) {
        const colabRef = doc(db, "colaboradores", colabId);
        batch.update(colabRef, fields);

        if (fields.departamento && fields.departamento === novoNome) {
           const userSnap = await getDoc(colabRef);
           if (userSnap.exists()) {
             const userData = userSnap.data();
             if (userData.departamento && userData.departamento !== novoNome) {
                const oldDeptId = await findDepartamentoIdByName(userData.departamento);
                if (oldDeptId && oldDeptId !== id) {
                   const oldDeptRef = doc(db, "departamentos", oldDeptId);
                   batch.update(oldDeptRef, {
                      colaboradoresIds: arrayRemove(colabId)
                   });
                }
             }
           }
        }
      }

      await batch.commit();
      return true;
    } catch (error) {
      console.error("Erro ao editar departamento:", error);
      return false;
    }
  };

  return { departamentos, loading, adicionarDepartamento, removerDepartamento, editarDepartamento };
}