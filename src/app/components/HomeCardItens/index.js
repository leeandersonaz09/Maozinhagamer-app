/* Core */
import React from "react";
/* Presentational */
import { View, Text, ImageBackground } from "react-native";

import styles from "./styles";

const HomeCard = ({ data: { img, tittle } }) => (
  <>
    <View style={styles.container}>
      <ImageBackground
        source={img}
        style={styles.image}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.darkOverlay}></View>
        <View style={styles.TextImageContainer}>
          <Text style={styles.TextImage}>{tittle}</Text>
        </View>
      </ImageBackground>
    </View>
  </>
);

export default HomeCard;
