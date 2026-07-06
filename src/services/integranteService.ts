import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import type { Integrante } from "@/types";

const COLLECTION = "integrantes";

export function subscribeIntegrantes(callback: (integrantes: Integrante[]) => void) {
  const q = query(collection(db, COLLECTION), orderBy("nombre"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Integrante)));
  });
}

export async function addIntegrante(nombre: string) {
  await addDoc(collection(db, COLLECTION), {
    nombre: nombre.trim(),
    createdAt: Date.now(),
  });
}
