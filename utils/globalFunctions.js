import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_VERSION = 2;
const DEFAULT_MAX_AGE_MS = 1000 * 60 * 30;

const isEnvelope = (value) =>
  value &&
  typeof value === "object" &&
  "data" in value &&
  "updatedAt" in value;

const normalizeEnvelope = (storedValue) => {
  if (!storedValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(storedValue);

    if (isEnvelope(parsed)) {
      return parsed;
    }

    return {
      version: 1,
      data: parsed,
      updatedAt: 0,
    };
  } catch (error) {
    return null;
  }
};

export const getCachedEnvelope = async (key) => {
  const storedValue = await AsyncStorage.getItem(key);
  return normalizeEnvelope(storedValue);
};

export const getCachedData = async (key) => {
  const envelope = await getCachedEnvelope(key);
  return envelope?.data ?? null;
};

export const saveCachedData = async (key, data) => {
  const envelope = {
    version: CACHE_VERSION,
    data,
    updatedAt: Date.now(),
  };

  await AsyncStorage.setItem(key, JSON.stringify(envelope));
  return envelope;
};

export const loadDataIfNeeded = async (
  key,
  fetchFunction,
  options = {}
) => {
  const { forceRefresh = false, maxAgeMs = DEFAULT_MAX_AGE_MS } = options;
  const cachedEnvelope = await getCachedEnvelope(key);
  const hasFreshCache =
    !forceRefresh &&
    cachedEnvelope &&
    Date.now() - cachedEnvelope.updatedAt < maxAgeMs;

  if (hasFreshCache) {
    return cachedEnvelope.data;
  }

  try {
    const fetchedData = await fetchFunction();

    if (fetchedData !== null && fetchedData !== undefined) {
      await saveCachedData(key, fetchedData);
      return fetchedData;
    }

    return cachedEnvelope?.data ?? null;
  } catch (error) {
    return cachedEnvelope?.data ?? null;
  }
};

export const clearIsNew = async () => {
  try {
    await AsyncStorage.removeItem("isnewinApp");
    return "Chave 'isnewinApp' foi removida do AsyncStorage.";
  } catch (error) {
    return "Erro ao limpar a chave 'isnewinApp'.";
  }
};

export const checkIsNewAfterClear = async () => {
  const value = await AsyncStorage.getItem("isnewinApp");
  return value === null
    ? "Valor apos remocao: null"
    : `Valor apos remocao: ${value}`;
};

export const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    return "AsyncStorage limpo com sucesso!";
  } catch (error) {
    return `Erro ao limpar AsyncStorage: ${error.message}`;
  }
};
