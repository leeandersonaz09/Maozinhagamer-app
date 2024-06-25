import React from "react";
import { WebView } from "react-native-webview";
import { Header } from "../components/index.js";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../Theme/theme.js";
const HomeCard = (props) => {
  //const { href, tittle, uri } = props;
  const { id, tittle, uri } = useLocalSearchParams();
  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <Header replace HeaderTittle={tittle} href={"/(tabs)"} />
      <WebView source={{ uri: uri }} style={{ flex: 1 }} />
    </>
  );
};

export default HomeCard;
