import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "./firebaseConfig"; // Usando sua configuração existente!

/**
 * Salva um token de notificação push no Firestore, evitando duplicatas.
 * @param {string} token O ExpoPushToken a ser salvo.
 */
export const saveTokenToFirestore = async (token) => {
  if (!token) {
    console.log("Token de push inválido, não será salvo.");
    return;
  }

  try {
    // Usamos o próprio token como ID do documento para garantir unicidade.
    const tokenDocRef = doc(FIREBASE_DB, "PushNotificationTokens", token);

    // Verificamos se o documento já existe para evitar uma escrita desnecessária.
    // A regra de segurança é a garantia final, mas isso economiza operações de escrita.
    const docSnap = await getDoc(tokenDocRef);

    if (!docSnap.exists()) {
      // Se não existe, cria o documento. A regra de segurança impedirá a sobre-escrita.
      await setDoc(tokenDocRef, {
        createdAt: serverTimestamp(),
      });
      console.log("Token de Push salvo no Firestore com sucesso!");
    } else {
      console.log("Token de Push já existe no Firestore.");
    }
  } catch (error) {
    console.error("Erro ao salvar o token no Firestore:", error);
  }
};