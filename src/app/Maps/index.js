import React from "react";
import { View, Text } from "react-native";
import { WebView } from "react-native-webview";
import { Header } from "../components/index.js";
import styles from "../Theme/styles/AboutStyles.js";

const Maps = () => (
  <>
    <Header>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.headerTitle}>Fale Conosco</Text>
        </View>
      </View>
    </Header>
    <WebView
      source={{ uri: "https://wzhub.gg/map/urzikstan/mwz" }}
      style={{ flex: 1 }}
    />
  </>
);

export default Maps;
