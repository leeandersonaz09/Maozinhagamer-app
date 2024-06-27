import React, { useEffect, useState, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../Theme/theme";
import { getSponsor } from "../utils/apiRequests"; // Importe as funções

const Patrocinador = () => {
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getData() {
    try {
      const data = await getSponsor();
      setApiData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados da API:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData(); // Tente obter dados em cache primeiro
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
