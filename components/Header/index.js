import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar, // 1. Importar StatusBar
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // 2. Importar o hook
import { SIZES } from "../../constants/Theme/theme";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function Header(props) {
  const { HeaderTittle: title, href: route } = props;
  const router = useRouter();
  const insets = useSafeAreaInsets(); // 3. Obter a altura da área segura (status bar)

  // 4. Definir a cor do header e da status bar
  const headerBackgroundColor = "#2E0000";

  return (
    // 5. Removemos o SafeAreaView como wrapper
    <>
      {/* 6. Adicionamos a View que colore a área da StatusBar */}
      <View
        style={{ height: insets.top, backgroundColor: headerBackgroundColor }}
      />

      {/* 7. Adicionamos o componente StatusBar para controlar os ícones */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={headerBackgroundColor}
      />

      {/* 8. O seu header original, agora com o estilo corrigido */}
      <View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
        {props.children}
        <View style={styles.headerContent}>
          {route && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <FontAwesome name="arrow-circle-left" size={38} color="white" />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.HeaderTittle}>{title}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

// 9. Estilos ajustados para serem mais flexíveis
const styles = StyleSheet.create({
  header: {
    // Removemos height e marginTop fixos para que se adapte a qualquer tela
    minHeight: 60, // Usamos uma altura mínima
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    paddingVertical: 10, // Usamos padding vertical para dar espaçamento interno
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
    // Adicionamos zIndex para garantir que o botão fique clicável
    zIndex: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  HeaderTittle: {
    fontSize: SIZES.headerTittle,
    color: "white", // Cor do texto do título
    fontWeight: "bold",
  },
});
