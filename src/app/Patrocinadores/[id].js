import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Header } from "../components/index.js";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import { SIZES, COLORS } from "../Theme/theme.js";
import { Link, useLocalSearchParams } from "expo-router";

const Patrocinadores = () => {
  const { id, tittle, img, text, category } = useLocalSearchParams();

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
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
            <Text style={styles.headerTitle}>{category}</Text>
          </View>
        </View>
      </Header>
      <ScrollView>
        <View style={styles.patrocinadorContainer}>
          {/* Dados do patrocinador */}
          <Text style={styles.subtitle}>{tittle}</Text>
          <Image source={{ uri: img }} style={styles.image} />
          <Text style={styles.description}>{text}</Text>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    paddingLeft: 14,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    paddingRight: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  patrocinadorContainer: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    borderRadius: 20,
    marginBottom: 15,
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: SIZES.header,
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default Patrocinadores;
