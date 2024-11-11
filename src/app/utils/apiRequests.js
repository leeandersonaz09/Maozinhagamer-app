// api.js
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB  } from './firebaseConfig'; // relative path to firebaseConfig.js

// Remove duplicados e gera IDs temporários para itens sem ID
const processUniqueData = (data) => {
  return data
    .filter((item, index, self) => 
      index === self.findIndex((t) => t.id === item.id)
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
        tittle: "Maozinha Gamer",
        uri: "https://www.youtube.com/@maozinhagamer_diih",
        text: "Maozinhag Gamer",
      },
    ]);
  }
}

export async function getMembers() {
  try {
    // Fetch data from Firestore
    const querySnapshot = await getDocs(collection(FIREBASE_DB, 'members'));

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
    const response = await fetch(
      "https://restapimaozinhagamer.onrender.com/banner"
    );
    const data = await response.json();
    return processUniqueData(data);
  } catch (error) {
    console.error("Erro ao obter dados da API BANNER:", error);
    return processUniqueData([
      {
        id: 1,
        img: "https://i.ytimg.com/vi/zoQoqNLTZtc/hq720_live.jpg",
        href: "https://www.youtube.com/@maozinhagamer_diih",
        buttonTittle: "Saiba mais",
        category: "Patrocinadores",
        tittle: "Maozinha Gamer",
        text: "Mãozinha Gamer é um canal no YouTube dedicado a conteúdo relacionado a jogos...",
      },
    ]);
  }
}


export async function getUpdateNotes() {
  try {
    const response = await fetch(
      "https://restapimaozinhagamer.onrender.com/updatenotes"
    );
    const data = await response.json();
    return processUniqueData(data);
  } catch (error) {
    console.error("Erro ao obter dados da API updateNotes:", error);
    return null;
  }
}

export async function fetchWidgetsData() {
  try {
    // Fetch data from Firestore
    const querySnapshot = await getDocs(collection(FIREBASE_DB, 'widgets'));

    // Map Firestore documents to a format similar to your existing API response
    const data = querySnapshot.docs.map((doc, index) => {
      const docData = doc.data();
      return {
        id: doc.id || `temp-widget-id-${index}`, // Gera ID temporário se estiver ausente
        img: docData.img,
        href: docData.href,
        tittle: docData.tittle,
        uri: docData.uri,
        openInApp: docData.openInApp,
      };
    });

    return processUniqueData(data);

  } catch (error) {
    console.error("Erro ao obter dados do Firestore:", error);

    // Fallback data in case of error
    const fallbackData = [
      {
        id: 456456688,
        img: "https://drive.google.com/uc?export=download&id=1ynpL_S9eqco03eenPn_0GDWJozOA9LFm",
        href: "/Maps",
        tittle: "Call of Duty",
        uri: "https://wzhub.gg/pt/map",
        openInApp: true,
      },
      {
        id: 456456745,
        img: "https://drive.google.com/uc?export=download&id=1OpKmEyfcav0whFKtJXFqBbU0g3o_jBSe",
        href: "/Loadouts",
        tittle: "The First Descendant",
        uri: "https://wzhub.gg/pt/loadouts",
        openInApp: true,
      },
      {
        id: 456485645,
        img: "https://drive.google.com/uc?export=download&id=1W5KkxklATX8dQUIidDeFs-7cM5I-zA0K",
        href: "vnd.youtube://www.youtube.com/@maozinhagamer_diih/streams",
        tittle: "Fortnite",
        uri: "",
        openInApp: false,
      },
      {
        id: 4564879524,
        img: "https://drive.google.com/uc?export=download&id=1fCMkr4Pbt6CWSbz1HTLz2wvmV61MJJUI",
        href: "/Pix",
        tittle: "Throne and Liberty",
        uri: "https://livepix.gg/diih145807",
        openInApp: true,
      },
    ];

    return processUniqueData(fallbackData);
  }

  return data;
}
