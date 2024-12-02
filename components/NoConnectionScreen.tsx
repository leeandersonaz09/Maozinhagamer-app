import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import LottieView from "lottie-react-native";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { StatusBar } from "expo-status-bar";

const NoConnectionScreen = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Monitorando mudanças na conexão com a internet
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(!!state.isConnected);
      setIsChecking(false); // Ao verificar, paramos a tela de carregamento
    });

    return () => unsubscribe(); // Limpa o listener ao desmontar o componente
  }, []);

  // Função de tentativa de recarregar a página
  const handleRetry = async () => {
    // Verifica se há conexão antes de tentar ir para a home
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      router.replace("/(tabs)"); // Substitui a tela atual pela home
    } else {
      alert("Ainda sem conexão. Tente novamente.");
    }
  };

  if (isChecking) {
    return (
      <View style={styles.center}>
        <Text>Verificando a conexão...</Text>
      </View>
    );
  }

  return (
    <>
      <ThemedView style={styles.container}>
        <LottieView
          source={require("../assets/Lotties/no-internet4.json")}
          autoPlay
          loop
          style={styles.animation}
        />
        <ThemedText style={styles.message}>
          Não conseguimos conectar à internet. Por favor, verifique sua conexão.
        </ThemedText>
        <Button title="Tentar novamente" onPress={handleRetry} />
      </ThemedView>
      <StatusBar style="auto" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "#fff",
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
