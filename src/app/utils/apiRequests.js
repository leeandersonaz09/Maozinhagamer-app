// api.js
import firestore from "@react-native-firebase/firestore";

export async function getSponsor() {
  try {
    const response = await fetch(
      "https://restapimaozinhagamer.onrender.com/patrocinadores"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter dados da API SPONSOR:", error);
    return [
      {
        id: 1,
        img: "https://i.ytimg.com/vi/zoQoqNLTZtc/hq720_live.jpg",
        category: "Patrocinadores",
        tittle: "Maozinha Gamer",
        uri: "https://www.youtube.com/@maozinhagamer_diih",
        text: "Maozinhag Gamer",
      },
    ];
  }
}

export async function getMembers() {
  try {
    const response = await fetch(
      "https://restapimaozinhagamer.onrender.com/members"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter dados da API MEMBERS:", error);
    const data = [
      {
        id: 1,
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
        id: 2,
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
    ];
    return data;
  }
}

export async function getBannerData() {
  try {
    const response = await fetch(
      "https://restapimaozinhagamer.onrender.com/banner"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter dados da API BANNER:", error);
    return [
      {
        id: 1,
        img: "https://i.ytimg.com/vi/zoQoqNLTZtc/hq720_live.jpg",
        href: "https://www.youtube.com/@maozinhagamer_diih",
        buttonTittle: "Saiba mais",
        category: "Patrocinadores",
        tittle: "Maozinha Gamer",
        text: "Mãozinha Gamer é um canal no YouTube dedicado a conteúdo relacionado a jogos...",
      },
    ];
  }
}

export async function getUpdateNotes() {
  try {
    const response = await fetch(
      "https://restapimaozinhagamer.onrender.com/updatenotes"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter dados da API updateNotes:", error);
    return null;
  }
}

export async function fetchSubscriberCount() {
  try {
    /*const response = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCB8jsTfkY-7YP8ULi8mfuOw&key=AIzaSyCXKMARPazopeEURqx_itTOeIAT-uNwjNw"
    );*/
    const response = await fetch(
      "https://restapimaozinhagamer.onrender.com/subscribersNumber"
    );
    const data = await response.json();

    /*if (data.items) {
      const subscriberCount = data.items[0].statistics.subscriberCount;
      return subscriberCount;
    }*/
    return data[0].subscriber;
  } catch (error) {
    console.error("Erro ao obter dados da API YOUTUBE:", error);
    const subscriberCount = 0;
    return subscriberCount;
  }
}

export async function fetchWidgetsData() {
  try {
    const test = await firestore().collection("widgets").get();
    console.log(test);

    const response = await fetch(
      "https://restapimaozinhagamer.onrender.com/widgets"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter dados da API updateNotes:", error);

    const data = [
      {
        id: 1,
        img: "https://drive.google.com/uc?export=download&id=1ynpL_S9eqco03eenPn_0GDWJozOA9LFm",
        href: "/Maps",
        tittle: "Call of Duty",
        uri: "https://wzhub.gg/pt/map",
        openInApp: true,
      },
      {
        id: 2,
        img: "https://drive.google.com/uc?export=download&id=1OpKmEyfcav0whFKtJXFqBbU0g3o_jBSe",
        href: "/Loadouts",
        tittle: "The First Descendant",
        uri: "https://wzhub.gg/pt/loadouts",
        openInApp: true,
      },
      {
        id: 3,
        img: "https://drive.google.com/uc?export=download&id=1W5KkxklATX8dQUIidDeFs-7cM5I-zA0K",
        href: "vnd.youtube://www.youtube.com/@maozinhagamer_diih/streams",
        tittle: "Fortnite",
        uri: "",
        openInApp: false,
      },
      {
        id: 4,
        img: "https://drive.google.com/uc?export=download&id=1fCMkr4Pbt6CWSbz1HTLz2wvmV61MJJUI",
        href: "/Pix",
        tittle: "Throne and Liberty",
        uri: "https://livepix.gg/diih145807",
        openInApp: true,
      },
    ];

    return data;
  }

  return data;
}
