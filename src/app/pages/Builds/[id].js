import { useSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList } from "react-native";

export default function BuildDetails() {
  // Obtém os parâmetros da URL
  const { id, name, description, sets } = useSearchParams();

  // Converte os dados de `sets` de volta para JSON
  const parsedSets = JSON.parse(sets);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.subtitle}>Sets:</Text>

      {/* Lista os sets */}
      <FlatList
        data={parsedSets}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.setItem}>
            <Text style={styles.setName}>{item.name}</Text>
            <Text style={styles.setDetails}>{item.details}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  setItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  setName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  setDetails: {
    fontSize: 14,
    color: "#666",
  },
});
