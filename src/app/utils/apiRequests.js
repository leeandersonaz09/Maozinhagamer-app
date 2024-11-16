import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "./firebaseConfig"; // relative path to firebaseConfig.js

// Remove duplicados e gera IDs temporários para itens sem ID
const processUniqueData = (data) => {
  return data
    .filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    )
    .map((item, index) => ({
      ...item,
      id: item.id || `temp-id-${index}`, // Gera ID temporário se não houver um
    }));
};

export async function getSponsor() {
  try {
    const response = await fetch(
      "https://restapimaozinhagamer.onrender.com/patrocinadores"
    );
    const data = await response.json();
    return processUniqueData(data);
  } catch (error) {
    console.error("Erro ao obter dados da API SPONSOR:", error);
    return processUniqueData([
      {
        id: 45672321,
        img: "https://i.ytimg.com/vi/zoQoqNLTZtc/hq720_live.jpg",
        category: "Patrocinadores",
        title: "Maozinha Gamer",
        uri: "https://www.youtube.com/@maozinhagamer_diih",
        text: "Maozinhag Gamer",
      },
    ]);
  }
}

export async function getMembers() {
  try {
    // Fetch data from Firestore
    const querySnapshot = await getDocs(collection(FIREBASE_DB, "members"));

    // Map Firestore documents to a format similar to your existing API response
    const data = querySnapshot.docs.map((doc, index) => {
      const docData = doc.data();
      return {
        id: doc.id || `temp-member-id-${index}`, // Gera ID temporário se estiver ausente
        name: docData.name,
        followers: docData.followers,
        image: docData.image,
        playstationTag: docData.playstationTag,
        xboxTag: docData.xboxTag,
        pcTag: docData.pcTag,
        xbox: docData.xbox,
        pc: docData.pc,
        ps: docData.ps,
      };
    });

    return processUniqueData(data);
  } catch (error) {
    console.error("Erro ao obter dados do Firestore MEMBERS:", error);
    // Em caso de erro, retornando os dados de fallback
    return processUniqueData([
      {
        id: 16580564,
        name: "Lee Brasil",
        followers: "@LeeBrasil",
        image:
          "https://drive.google.com/uc?export=download&id=1oc3Ac_QKUe-TWfCw70c_R8a8lM1ZNtB8",
        playstationTag: "",
        xboxTag: "",
        pcTag: "https://steamcommunity.com/profiles/76561198346396599",
        xbox: true,
        pc: true,
        ps: false,
      },
      {
        id: 2345647,
        name: "LoneWolf",
        followers: "@SamLoneWolf7",
        image:
          "https://drive.google.com/uc?export=download&id=111bfKjGuHO4wJ8gXdE4EB6XO9kESh9CA",
        playstationTag: "",
        xboxTag: "",
        pcTag: "",
        xbox: false,
        pc: true,
        ps: false,
      },
    ]);
  }
}

export async function getBannerData() {
  try {
    // Fetch data from Firestore
    const querySnapshot = await getDocs(
      collection(FIREBASE_DB, "banners")
    );

    // Map Firestore documents to a format similar to your existing API response
    const data = querySnapshot.docs.map((doc, index) => {
      const docData = doc.data();
      //console.log(docData);
      return {
        id: doc.id || `temp-banner-id-${index}`, // Gera ID temporário se estiver ausente
        img: docData.img,
        buttonTittle: docData.buttonTittle,
        title: docData.title,
        href: docData.uri,
        category: docData.category,
        text:docData.text
      };
    });

    return processUniqueData(data);
  } catch (error) {
    console.error("Erro ao obter dados da API BANNER:", error);
    return processUniqueData([
      {
        id: 65456879,
        img: "https://i.ytimg.com/vi/zoQoqNLTZtc/hq720_live.jpg",
        href: "https://www.youtube.com/@maozinhagamer_diih",
        buttonTittle: "Saiba mais",
        category: "Patrocinadores",
        title: "Maozinha Gamer",
        text: "Mãozinha Gamer é um canal no YouTube dedicado a conteúdo relacionado a jogos...",
      },
    ]);
  }
}

export async function getUpdateNotes() {
  try {
    // Fetch data from Firestore
    const querySnapshot = await getDocs(
      collection(FIREBASE_DB, "Canais Parceiros")
    );

    // Map Firestore documents to a format similar to your existing API response
    const data = querySnapshot.docs.map((doc, index) => {
      const docData = doc.data();
      //console.log(docData);
      return {
        id: doc.id || `temp-notes-id-${index}`, // Gera ID temporário se estiver ausente
        img: docData.img,
        title: docData.title,
        uri: docData.uri,
      };
    });

    return processUniqueData(data);
  } catch (error) {
    console.error("Erro ao obter dados da API updateNotes:", error);
    return null;
  }
}

export async function fetchWidgetsData() {
  try {
    // Fetch data from the main 'widgets' collection
    const querySnapshot = await getDocs(collection(FIREBASE_DB, "widgets"));

    // Map Firestore documents to a format similar to your existing API response
    const data = await Promise.all(
      querySnapshot.docs.map(async (doc, index) => {
        const docData = doc.data();

        // Inicialmente, assume que não há sub-coleção
        let subCollectionData = [];

        // Verificar e acessar a sub-coleção de 'subCollectionName' dentro do documento atual
        const subCollectionSnapshot = await getDocs(
          collection(FIREBASE_DB, `widgets/${doc.id}/sub_widgets`)
        );

        // Se a sub-coleção existir, mapeie os documentos dentro dela
        subCollectionData = subCollectionSnapshot.docs.map((subDoc) => ({
          id: subDoc.id,
          ...subDoc.data(),
        }));

        return {
          id: doc.id || `temp-widget-id-${index}`, // Gera ID temporário se estiver ausente
          img: docData.img,
          href: docData.href,
          title: docData.title,
          uri: docData.uri,
          openInApp: docData.openInApp,
          subCollection: subCollectionData, // Adicione os dados da sub-coleção aqui
        };
      })
    );

    return processUniqueData(data);
  } catch (error) {
    console.error("Erro ao obter dados do Firestore:", error);

    // Dados de fallback em caso de erro
    const fallbackData = [
      {
        id: 456456688,
        img: "https://drive.google.com/uc?export=download&id=1ynpL_S9eqco03eenPn_0GDWJozOA9LFm",
        href: "/Maps",
        title: "Call of Duty",
        uri: "https://wzhub.gg/pt/map",
        openInApp: true,
      },
      {
        id: 456456745,
        img: "https://drive.google.com/uc?export=download&id=1OpKmEyfcav0whFKtJXFqBbU0g3o_jBSe",
        href: "/Loadouts",
        title: "The First Descendant",
        uri: "https://wzhub.gg/pt/loadouts",
        openInApp: true,
      },
      {
        id: 456485645,
        img: "https://drive.google.com/uc?export=download&id=1W5KkxklATX8dQUIidDeFs-7cM5I-zA0K",
        href: "vnd.youtube://www.youtube.com/@maozinhagamer_diih/streams",
        title: "Fortnite",
        uri: "",
        openInApp: false,
      },
      {
        id: 4564879524,
        img: "https://drive.google.com/uc?export=download&id=1fCMkr4Pbt6CWSbz1HTLz2wvmV61MJJUI",
        href: "/Pix",
        title: "Throne and Liberty",
        uri: "https://livepix.gg/diih145807",
        openInApp: true,
      },
    ];

    return processUniqueData(fallbackData);
  }
}
