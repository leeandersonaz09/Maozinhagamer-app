import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { Button } from "../components";

const { height } = Dimensions.get("window");
export const SLIDE_HEIGHT = 0.61 * height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 44,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 10,
    color: "#0C0D34",
    textAlign: "center",
  },
  description: {
    fontSize: 12,
    lineHeight: 24,
    color: "#0C0D34",
    textAlign: "center",
    marginBottom: 20,
  },
});

// Definição de tipos das props
type SubslideProps = {
  description: string;
  subtitle: string;
  last: boolean;
  onPress: () => void;
};

const Subslide: React.FC<SubslideProps> = ({
  description,
  subtitle,
  last,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.description}>{description}</Text>
      <Button
        label={last ? "Vamos começar?" : "Próximo"}
        variant={last ? "primary" : "default"}
        onPress={onPress}
      />
    </View>
  );
};

export default Subslide;
