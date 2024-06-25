import React, { useEffect, useState, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../Theme/theme";

async function getData() {
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
        uri: "https://chat.whatsapp.com/ETCJi0tjrmtGdBddUTP6IK",
        text: "Maozinhag Gamer",
      },
    ];
  }
}

const Patrocinador = () => {
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = await getData(); // Tente obter dados em cache primeiro
      setApiData(cachedData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Use useMemo para armazenar os dados em cache
  const memoizedApiData = useMemo(() => apiData, [apiData]);

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View
        style={{ flex: 1, marginBottom: 60, backgroundColor: COLORS.white }}
      >
        {isLoading ? (
          <ActivityIndicator color="red" size="large" style={{ flex: 1 }} />
        ) : (
          <WebView source={{ uri: memoizedApiData[0].uri }} />
        )}
      </View>
    </>
  );
};

export default Patrocinador;
