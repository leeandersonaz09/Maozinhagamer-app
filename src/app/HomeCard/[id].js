import React from "react";
import { WebView } from "react-native-webview";
import { Header } from "../components/index.js";
import { useLocalSearchParams } from "expo-router";

const HomeCard = (props) => {
  //const { href, tittle, uri } = props;
  const { id, tittle, uri } = useLocalSearchParams();
  return (
    <>
      <Header HeaderTittle={tittle} href={"/"} />
      <WebView source={{ uri: uri }} style={{ flex: 1 }} />
    </>
  );
};

export default HomeCard;
