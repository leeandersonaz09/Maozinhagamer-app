import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { FIREBASE_DB } from "./firebaseConfig";

/**
 * Salva um token de notificacao push no Firestore, evitando duplicatas e
 * persistindo as preferencias de segmentacao do usuario.
 * @param {string} token
 * @param {object} preferences
 */
export const saveTokenToFirestore = async (token, preferences = null) => {
  if (!token) {
    console.log("Token de push invalido, nao sera salvo.");
    return;
  }

  try {
    const tokenDocRef = doc(FIREBASE_DB, "PushNotificationTokens", token);
    const docSnap = await getDoc(tokenDocRef);

    const payload = {
      token,
      preferences,
      platform: token.startsWith("ExponentPushToken") ? "expo" : "unknown",
      updatedAt: serverTimestamp(),
      ...(docSnap.exists() ? {} : { createdAt: serverTimestamp() }),
    };

    await setDoc(tokenDocRef, payload, { merge: true });
    console.log("Token de Push salvo no Firestore com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar o token no Firestore:", error);
  }
};
