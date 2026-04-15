// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  arrayUnion,
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

export async function getNotificacoesNaoLidas() {
  const mensagensRef = collection(db, "mensagens");
  const mensagensQuery = query(
    mensagensRef,
    where("lida", "==", false),
    orderBy("data_envio", "desc"),
  );
  const querySnapshot = await getDocs(mensagensQuery);

  return querySnapshot.docs.map((mensagemDoc) => ({
    id: mensagemDoc.id,
    ...mensagemDoc.data(),
  }));
}

export async function getHistoricoPlanta(plantaId) {
  const mensagensRef = collection(db, "mensagens");
  const historicoQuery = query(
    mensagensRef,
    where("planta_id", "==", plantaId),
    orderBy("data_envio", "desc"),
  );
  const querySnapshot = await getDocs(historicoQuery);

  return querySnapshot.docs.map((mensagemDoc) => ({
    id: mensagemDoc.id,
    ...mensagemDoc.data(),
  }));
}

export async function getMensagensNaoLidas() {
  return getNotificacoesNaoLidas();
}

export async function marcarMensagemComoLida(mensagemId) {
  const mensagemRef = doc(db, "mensagens", mensagemId);
  await updateDoc(mensagemRef, {
    lida: true,
  });
}

export async function adicionarNotaManual(plantaId, texto, plantaNome) {
  await addDoc(collection(db, "mensagens"), {
    planta_id: plantaId,
    planta_nome: plantaNome,
    mensagem: texto,
    tipo: "manual",
    lida: true,
    nivel_alerta: 0,
    data_envio: serverTimestamp(),
  });
}

export async function adicionarFotoGaleriaPlanta(plantaId, imagemUrl) {
  if (!plantaId || !imagemUrl) {
    throw new Error("Dados invalidos para adicionar foto na galeria");
  }

  const plantaRef = doc(db, "plantas", plantaId);
  await updateDoc(plantaRef, {
    galeria_fotos: arrayUnion({
      id: `foto-${Date.now()}`,
      url: imagemUrl,
      origem: "scanner",
      data_captura: new Date().toISOString(),
    }),
  });
}

export async function getHistoricoFotos(plantaId) {
  const fotosRef = collection(db, "fotos");
  const historicoQuery = query(
    fotosRef,
    where("planta_id", "==", plantaId),
    orderBy("data_registro", "asc"),
  );
  const querySnapshot = await getDocs(historicoQuery);

  return querySnapshot.docs.map((fotoDoc) => {
    const fotoData = fotoDoc.data();

    return {
      id: fotoDoc.id,
      url: fotoData.url ?? "",
      data_registro: fotoData.data_registro ?? null,
      nota: fotoData.nota ?? "",
    };
  });
}