import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import dataloading from "../../assets/Lotties/13255-loader.json";
import mario from "../../assets/Lotties/mario.json";
import { COLORS } from "../../constants/Theme/theme.js";
import { StatusBar } from "expo-status-bar";

const LottieLoading: React.FC = () => {
  return (
    <View style={styles.container}>
      <LottieView autoPlay style={styles.loaderLottie} source={dataloading} />

      <View style={styles.loadingTextContainer}>
        <Text style={styles.loadingText}>
          Aguarde enquanto arrumamos tudo para você!
        </Text>
        <ActivityIndicator size="small" color={COLORS.yellow} />
      </View>
      <LottieView autoPlay style={styles.marioLottie} source={mario} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  loaderLottie: {
    width: 300,
    height: 300,
  },
  loadingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 12,
    marginVertical: 20,
    paddingRight: 20,
  },
  marioLottie: {
    width: 200,
    height: 200,
    marginTop: -50,
  },
});

export default LottieLoading;
