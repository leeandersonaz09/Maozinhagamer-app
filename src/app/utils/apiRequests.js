// api.js
export async function getSponsor() {
  try {
    const response = await fetch(
      "https://restapimaozinhagamer.onrender.com/patrocinadores"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter dados da API:", error);
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
    console.error("Erro ao obter dados da API:", error);
    return null;
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
    console.error("Erro ao obter dados da API:", error);
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

export async function fetchSubscriberCount() {
  try {
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCB8jsTfkY-7YP8ULi8mfuOw&key=AIzaSyCXKMARPazopeEURqx_itTOeIAT-uNwjNw"
    );
    const data = await response.json();
    if (data.items) {
      const subscriberCount = data.items[0].statistics.subscriberCount;
      return subscriberCount;
    }
  } catch (error) {
    console.error("Erro ao obter dados da API:", error);
    const subscriberCount = 0;
    return subscriberCount;
  }
}

export async function fetchWidgetsData() {
  const data = [
    {
      id: 1,
      img: require("../assets/map-image.webp"),
      href: "/Maps",
      tittle: "Mapas Interativos",
      uri: "https://wzhub.gg/pt/map",
      openInApp: true,
    },
    {
      id: 2,
      img: require("../assets/meta-loadout.jpeg"),
      href: "/Loadouts",
      tittle: "Meta Loadouts",
      uri: "https://wzhub.gg/pt/loadouts",
      openInApp: true,
    },
    {
      id: 3,
      img: require("../assets/youtube-card.png"),
      href: "vnd.youtube://www.youtube.com/@maozinhagamer_diih/streams",
      tittle: "Lives Youtube",
      uri: "",
      openInApp: false,
    },
    {
      id: 4,
      img: require("../assets/nos-ajude.jpg"),
      href: "/Pix",
      tittle: "Ajude com Pix",
      uri: "https://livepix.gg/diih145807",
      openInApp: true,
    },
  ];

  return data;
}
