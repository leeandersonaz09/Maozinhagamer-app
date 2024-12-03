import AsyncStorage from "@react-native-async-storage/async-storage";

//carrega apenas se necessário no asycn
export const loadDataIfNeeded = async (key, fetchFunction) => {
  try {
    const cachedData = await AsyncStorage.getItem(key);
    const fetchedData = await fetchFunction();

    if (!cachedData) {
      await AsyncStorage.setItem(key, JSON.stringify(fetchedData));
      return fetchedData;
    }

    const parsedCachedData = JSON.parse(cachedData);

    if (JSON.stringify(parsedCachedData) !== JSON.stringify(fetchedData)) {
      await AsyncStorage.setItem(key, JSON.stringify(fetchedData));
      return fetchedData;
    }

    return parsedCachedData;
  } catch (error) {
    //console.log(Erro ao carregar dados de ${key}:, error);
    return null;
  }
};

export const clearIsNew = async () => {
  try {
    await AsyncStorage.removeItem("isnewinApp");
    return "Chave 'isnewinApp' foi removida do AsyncStorage.";
  } catch (error) {
    return "Erro ao limpar a chave 'isnewinApp':";
  }
};

export const checkIsNewAfterClear = async () => {
  const value = await AsyncStorage.getItem("isnewinApp");
  return value === null
    ? "Valor após remoção: null"
    : `Valor após remoção: ${value}`;
};

export const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    return "AsyncStorage limpo com sucesso!";
  } catch (error) {
    return `Erro ao limpar AsyncStorage: ${error.message}`;
  }
};
