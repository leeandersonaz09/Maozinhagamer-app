import React from "react";
import { View, StatusBar, Text, ActivityIndicator } from "react-native";
import LottieView from "lottie-react-native";
import dataloading from "../../app/assets/Lotties/13255-loader.json";
import mario from "../../app/assets/Lotties/mario.json";
import { COLORS } from "../../app/Theme/theme";

function LottieLoading() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
      }}
    >
      <StatusBar animated={true} />

      <LottieView
        autoPlay
        style={{
          width: 300,
          height: 300,
          //backgroundColor: "#eee",
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={dataloading}
      />

      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            color: COLORS.white,
            fontWeight: "bold",
            fontSize: 12,
            marginVertical: 20,
            paddingRight: 20,
          }}
        >
          Aguarde enquanto arrumamos tudo para você!
        </Text>
        <ActivityIndicator size="small" color={COLORS.yellow} />
      </View>
      <LottieView
        autoPlay
        style={{
          width: 200,
          height: 200,
          marginTop: -50,
          //backgroundColor: "#eee",
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={mario}
      />
    </View>
  );
}

export default LottieLoading;
