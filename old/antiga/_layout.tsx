import { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import NoConnectionScreen from "../components/NoConnectionScreen"; // Importe o componente
import NetInfo from "@react-native-community/netinfo";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const [isConnected, setIsConnected] = useState<boolean>(true); // Estado inicial como `true`
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Simula a falta de conexão forçando o estado para `false`
    setIsConnected(false); // Simula a desconexão
    //const unsubscribe = NetInfo.addEventListener((state) => {
    //setIsConnected(!!state.isConnected); // O operador !! garante que o valor será sempre booleano
    //});
    // return () => unsubscribe();
  }, []);

  // Se a conexão estiver indisponível, renderiza a tela de erro
  if (!isConnected) {
    return <NoConnectionScreen />;
  }
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
