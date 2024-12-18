import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { COLORS, SIZES } from "../../constants/Theme/theme";
import { useRouter } from "expo-router"; // Importar o useRouter
import { FontAwesome } from "@expo/vector-icons";

export default function Header(props) {
  const { HeaderTittle: title, href: route } = props;
  const router = useRouter(); // Inicializar o router

  return (
    <SafeAreaView>
      <View style={styles.header}>
        {props.children}
        <View style={styles.headerContent}>
          {route && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()} // Usar router.back() para voltar
            >
              <FontAwesome name="arrow-circle-left" size={38} color="white" />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.HeaderTittle}>{title}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    width: "100%",
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    paddingTop: 20,
    paddingBottom: 10,
    //marginTop: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 14,
  },
  backButton: {
    position: "absolute",
    left: 14,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  HeaderTittle: {
    fontSize: SIZES.headerTittle,
    color: COLORS.white,
    fontWeight: "bold",
  },
});
