import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "./firebaseConfig"; // relative path to firebaseConfig.js

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
    uri: "https://fortnite.gg/",
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

// Função genérica para buscar dados de qualquer coleção
const fetchCollections = async (collectionName) => {
  try {
    // Fetch data from Firestore
    const querySnapshot = await getDocs(
      collection(FIREBASE_DB, collectionName)
    );

    // Map Firestore documents to a format similar to your existing API response
    const data = querySnapshot.docs.map((doc, index) => {
      const docData = doc.data();
      return {
        id: doc.id || `temp-${collectionName}-id-${index}`, // Gera ID temporário se não houver um
        ...docData, // Puxa diretamente todos os dados do documento
      };
    });

    return processUniqueData(data);
  } catch (error) {
    console.error(`Erro ao obter dados da coleção ${collectionName}:`, error);
    return null;
  }
};

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

        // Verificar e acessar a sub-coleção 'sub_widgets' dentro do documento atual
        const subCollectionSnapshot = await getDocs(
          collection(FIREBASE_DB, `widgets/${doc.id}/sub_widgets`)
        );

        // Se a sub-coleção existir, mapeie os documentos dentro dela
        subCollectionData = await Promise.all(
          subCollectionSnapshot.docs.map(async (subDoc) => {
            const subDocData = subDoc.data();

            // Inicialmente, assume que não há sub-coleção 'loadouts'
            let loadoutsData = [];

            // Verificar e acessar a sub-coleção 'loadouts' dentro do documento de 'sub_widgets'
            const loadoutsSnapshot = await getDocs(
              collection(
                FIREBASE_DB,
                `widgets/${doc.id}/sub_widgets/${subDoc.id}/loadouts`
              )
            );

            // Se a sub-coleção 'loadouts' existir, mapeie os documentos dentro dela
            loadoutsData = loadoutsSnapshot.docs.map((loadoutDoc) => ({
              id: loadoutDoc.id,
              ...loadoutDoc.data(),
            }));

            return {
              id: subDoc.id,
              loadouts: loadoutsData, // Inclua os dados da sub-coleção 'loadouts'
              ...subDocData,
            };
          })
        );

        return {
          id: doc.id || `temp-widget-id-${index}`, // Gera ID temporário se estiver ausente
          subCollection: subCollectionData, // Adicione os dados da sub-coleção 'sub_widgets' aqui
          ...docData, // Puxa diretamente todos os dados do documento
        };
      })
    );

    return processUniqueData(data);
  } catch (error) {
    console.error("Erro ao obter dados do Firestore:", error);
    return processUniqueData(fallbackData);
  }
}

// Funções específicas para cada coleção, usando a função genérica
export const fetchAdsBanner = () => fetchCollections("adsBanner");
export const fetchSponsors = () => fetchCollections("sponsors");
export const fetchOffers = () => fetchCollections("offers");
export const getMembers = () => fetchCollections("members");
export const getBannerData = () => fetchCollections("banners");
export const getUpdateNotes = () => fetchCollections("Canais Parceiros");
