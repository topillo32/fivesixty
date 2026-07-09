import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "./firebase";
import type { IntegrantePhoto } from "@/types";

const COLLECTION = "integrantes_photo";

export function subscribeIntegrantePhotos(
  callback: (photos: IntegrantePhoto[]) => void
) {
  const q = query(collection(db, COLLECTION));
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as IntegrantePhoto))
    );
  });
}
