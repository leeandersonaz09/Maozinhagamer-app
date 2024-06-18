import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { Header } from "../components/index.js";
import styles from "../Theme/styles/AboutStyles.js";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";

const Loadouts = () => (
  <>
    <Header>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{}}>
          <Link href={"/"} asChild>
            <TouchableOpacity style={{ paddingLeft: 14 }}>
              <FontAwesome name="arrow-circle-left" size={38} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
        <View
          style={{
            flex: 1,
            textAlign: "center",
            alignItems: "center",
            paddingRight: 40,
          }}
        >
          <Text style={styles.headerTitle}>Loadout Meta</Text>
        </View>
      </View>
    </Header>
    <WebView
      source={{ uri: "https://wzhub.gg/pt/loadouts" }}
      style={{ flex: 1 }}
    />
  </>
);

export default Loadouts;
