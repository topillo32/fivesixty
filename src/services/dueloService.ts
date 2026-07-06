import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import type { Duelo, Fase } from "@/types";

const COLLECTION = "duelos";

export function subscribeDuelos(callback: (duelos: Duelo[]) => void) {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Duelo)));
  });
}

interface NewDuelo {
  liga: string;
  fase: Fase;
  jugadorAId: string;
  jugadorBId: string;
  ganadorId: string;
}

export async function addDuelo(duelo: NewDuelo) {
  await addDoc(collection(db, COLLECTION), {
    ...duelo,
    createdAt: Date.now(),
  });
}
