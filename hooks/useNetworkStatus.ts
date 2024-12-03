// src/hooks/useNetworkStatus.js

import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true); // Definir como true por padrão, assumindo que o usuário está conectado

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(!!state.isConnected); // Atualiza o estado com o status da conexão
    });

    return () => unsubscribe(); // Limpar o listener ao desmontar o componente
  }, []);

  return isConnected; // Retorna o estado da conexão
};
