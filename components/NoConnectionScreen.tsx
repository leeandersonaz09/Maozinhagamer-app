import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  Alert,
  SafeAreaView,
} from "react-native";
import LottieView from "lottie-react-native";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

const NoConnectionScreen = () => {
  const colorScheme = useColorScheme(); // 'light' ou 'dark'
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(!!state.isConnected);
      setIsChecking(false); // Parar o carregamento após a verificação
    });

    return () => unsubscribe(); // Limpeza do listener
  }, []);

  // Função de tentativa de recarregar a página
  const handleRetry = () => {
    if (isConnected) {
      router.replace("/(tabs)"); // Substitui a tela atual pela home
    } else {
      Alert.alert("Sem conexão", "Ainda sem conexão. Tente novamente.");
    }
  };

  if (isChecking) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Verificando a conexão...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.Themedcontainer}>
          <LottieView
            source={require("../assets/Lotties/no-internet4.json")}
            autoPlay
            loop
            style={styles.animation}
          />
          <ThemedText style={styles.message}>
            Não conseguimos conectar à internet. Por favor, verifique sua
            conexão.
          </ThemedText>
          <Button title="Tentar novamente" onPress={handleRetry} />
        </ThemedView>
        <StatusBar
          style={colorScheme === "dark" ? "light" : "dark"} // Ajusta o estilo do texto da barra
          backgroundColor={colorScheme === "dark" ? "#121212" : "#FFFFFF"} // Cor de fundo conforme o tema
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Themedcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 200,
    height: 200,
  },
  message: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NoConnectionScreen;
