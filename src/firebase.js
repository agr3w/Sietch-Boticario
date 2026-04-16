// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  arrayUnion,
  addDoc,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
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

function gerarDataHoraLocalBr() {
  return new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour12: false,
  });
}

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

export async function adicionarFotoGaleriaPlanta(plantaId, imagemUrl, vitalidadeMomento = "estavel") {
  if (!plantaId || !imagemUrl) {
    throw new Error("Dados invalidos para adicionar foto na galeria");
  }

  const plantaRef = doc(db, "plantas", plantaId);
  const dataHoraLocalBr = gerarDataHoraLocalBr();
  const fotoId = `foto-${Date.now()}`;

  await updateDoc(plantaRef, {
    galeria_fotos: arrayUnion({
      id: fotoId,
      url: imagemUrl,
      origem: "scanner",
      badges: [],
      vitalidade: vitalidadeMomento,
      data_captura: new Date().toISOString(),
      data_registro_local: dataHoraLocalBr,
    }),
  });

  // Mantem a colecao fotos sincronizada com a galeria para permitir
  // marcacao de marcos e timeline ordenada por data_registro.
  await setDoc(
    doc(db, "fotos", fotoId),
    {
      planta_id: plantaId,
      url: imagemUrl,
      origem: "scanner",
      badges: [],
      vitalidade: vitalidadeMomento,
      data_captura: new Date().toISOString(),
      data_registro: serverTimestamp(),
      data_registro_local: dataHoraLocalBr,
    },
    { merge: true },
  );

  return { id: fotoId };
}

export async function cadastrarPlantaComFoto(dados, fotoBase64) {
  const vitalidadeInicial = dados?.vitalidade ?? "estavel";
  const dadosPlanta = {
    ...dados,
    vitalidade: vitalidadeInicial,
    ultima_rega: serverTimestamp(),
    notificar: true,
  };

  const plantaRef = await addDoc(collection(db, "plantas"), dadosPlanta);

  if (!fotoBase64 || typeof fotoBase64 !== "string") {
    return { id: plantaRef.id };
  }

  const dataHoraLocalBr = gerarDataHoraLocalBr();

  await addDoc(collection(db, "fotos"), {
    planta_id: plantaRef.id,
    url: fotoBase64,
    data_registro: serverTimestamp(),
    data_registro_local: dataHoraLocalBr,
    nota: "Primeiro registro morfologico da planta.",
    marco: "nascimento",
    status_emocional: "nascimento",
    badges: ["nascimento"],
    vitalidade: vitalidadeInicial,
    origem: "cadastro",
  });

  await updateDoc(doc(db, "plantas", plantaRef.id), {
    galeria_fotos: arrayUnion({
      id: `foto-${Date.now()}`,
      url: fotoBase64,
      origem: "nascimento",
      status_emocional: "nascimento",
      badges: ["nascimento"],
      vitalidade: vitalidadeInicial,
      data_captura: new Date().toISOString(),
      data_registro_local: dataHoraLocalBr,
    }),
  });

  return { id: plantaRef.id };
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
      data_registro_local: fotoData.data_registro_local ?? "",
      nota: fotoData.nota ?? "",
      marco: fotoData.marco ?? "",
      status_emocional: fotoData.status_emocional ?? "",
      origem: fotoData.origem ?? "",
      vitalidade: fotoData.vitalidade ?? "",
      badges: Array.isArray(fotoData.badges)
        ? fotoData.badges.filter((badge) => typeof badge === "string")
        : [],
    };
  });
}

export async function setMarcoFoto(fotoId, tipoMarco) {
  const tiposPermitidos = ["nascimento", "crescimento", "floracao", "memorial"];

  if (!fotoId) {
    throw new Error("Foto invalida para aplicar marco");
  }

  const removendoMarco = tipoMarco === null || typeof tipoMarco === "undefined";

  if (!removendoMarco && !tiposPermitidos.includes(tipoMarco)) {
    throw new Error("Tipo de marco invalido");
  }

  const fotoRef = doc(db, "fotos", fotoId);
  try {
    await updateDoc(fotoRef, {
      marco: removendoMarco ? deleteField() : tipoMarco,
    });
  } catch (error) {
    if (error?.code !== "not-found") {
      throw error;
    }

    // Registro legado sem documento na colecao fotos.
    // Se estiver removendo marco, nao ha nada para apagar.
    if (removendoMarco) {
      return { fotoId, marco: null };
    }

    await setDoc(
      fotoRef,
      {
        marco: tipoMarco,
      },
      { merge: true },
    );
  }

  return { fotoId, marco: removendoMarco ? null : tipoMarco };
}

export async function atualizarBadgesFoto(plantaId, fotoId, badges) {
  if (!plantaId || !fotoId) {
    throw new Error("Dados invalidos para atualizar badges da foto");
  }

  const badgesSanitizados = [
    ...new Set(
      (Array.isArray(badges) ? badges : [])
        .filter((badge) => typeof badge === "string")
        .map((badge) => badge.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];

  let atualizouEmAlgumLugar = false;

  try {
    const fotoRef = doc(db, "fotos", fotoId);
    await updateDoc(fotoRef, { badges: badgesSanitizados });
    atualizouEmAlgumLugar = true;
  } catch (error) {
    if (error?.code !== "not-found") {
      throw error;
    }
  }

  const plantaRef = doc(db, "plantas", plantaId);
  const plantaSnapshot = await getDoc(plantaRef);

  if (plantaSnapshot.exists()) {
    const dadosPlanta = plantaSnapshot.data();
    const galeriaAtual = Array.isArray(dadosPlanta?.galeria_fotos)
      ? dadosPlanta.galeria_fotos
      : [];

    let alterouGaleria = false;
    const galeriaAtualizada = galeriaAtual.map((foto) => {
      if (foto?.id !== fotoId) {
        return foto;
      }

      alterouGaleria = true;
      return {
        ...foto,
        badges: badgesSanitizados,
      };
    });

    if (alterouGaleria) {
      await updateDoc(plantaRef, {
        galeria_fotos: galeriaAtualizada,
      });
      atualizouEmAlgumLugar = true;
    }
  }

  if (!atualizouEmAlgumLugar) {
    throw new Error("Foto nao encontrada para atualizar badges");
  }

  return { badges: badgesSanitizados };
}