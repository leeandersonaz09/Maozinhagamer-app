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
