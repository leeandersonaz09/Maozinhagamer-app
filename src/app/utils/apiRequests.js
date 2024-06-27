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
