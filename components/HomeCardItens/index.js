/* Core */
import React from "react";
/* Presentational */
import { View, Text, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "./styles";
import { COLORS } from "../../constants/Theme/theme.js";

const HomeCard = ({ data: { img, title } }) => (
  <>
    <StatusBar backgroundColor={COLORS.primary} style="light" />
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: img }}
        style={styles.image}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.darkOverlay}></View>
        <View style={styles.TextImageContainer}>
          <Text style={styles.TextImage}>{title}</Text>
        </View>
      </ImageBackground>
    </View>
  </>
);

export default HomeCard;
