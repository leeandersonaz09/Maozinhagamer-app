import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import Separator from "../Separador";
import { COLORS, SIZES } from "../../constants/Theme/theme";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "react-native"; // Importando o hook useColorScheme
//import styles from "./styles";

const PopupMenu = (props) => {
  const { name, gamertag, icon, color } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const scale = useRef(new Animated.Value(0)).current;
  const [alertMessage, setAlertMessage] = useState("");
  const colorScheme = useColorScheme(); // Obtém o tema atual (light ou dark)
  // Determina a cor de fundo do card com base no tema
  const cardBackgroundColor = colorScheme === "dark" ? "#141414" : COLORS.card;

  useEffect(() => {
    if (modalVisible) {
      Clipboard.setStringAsync(gamertag);
      setAlertMessage("Gamertag copiado!");
      setTimeout(() => {
        setAlertMessage("");
      }, 2000); // fechar o alert após 2 segundos
    }
  }, [modalVisible]);

  function reziseBox(to) {
    to === 1 && setModalVisible(true);
    Animated.timing(scale, {
      toValue: to,
      useNativeDriver: true,
      duration: 300,
      easing: Easing.linear,
    }).start(() => to === 0 && setModalVisible(false));
  }

  return (
    <>
      <TouchableOpacity
        style={styles.followButton}
        onPress={() => reziseBox(1)}
      >
        <FontAwesome5 name={icon} size={24} color={color} />
        <Modal transparent visible={modalVisible}>
          <SafeAreaView
            style={styles.container}
            onTouchStart={() => reziseBox(0)}
          >
            <Animated.View
              style={[
                styles.popup,
                {
                  opacity: scale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
                {
                  transform: [{ scale }],
                },
                {
                  backgroundColor: cardBackgroundColor,
                },
              ]}
            >
              {alertMessage && (
                <ThemedText
                  style={{
                    fontSize: 16,
                    //color: COLORS.primary,
                    textAlign: "center",
                  }}
                >
                  {alertMessage}
                </ThemedText>
              )}

              <ThemedText style={styles.gamertagName}>{name}</ThemedText>
              <Separator />
              <ThemedText style={styles.gamertagaTextLogo}>
                Minha Gamer Tag
              </ThemedText>
              <View style={styles.gamertagView}>
                <FontAwesome5 name={icon} size={24} color={color} />
                <ThemedText style={styles.gamertagText}>{gamertag}</ThemedText>
              </View>
            </Animated.View>
          </SafeAreaView>
        </Modal>
      </TouchableOpacity>
    </>
  );
};

export default PopupMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: COLORS.playstation,
  },
  followButton: {
    padding: 8,
    marginTop: 10,
  },
  popup: {
    borderRadius: 8,
    borderColor: "#333",
    borderWidth: 1,
    //backgroundColor: "#141414",
    paddingHorizontal: 20,
    position: "absolute",
    top: 30,
    right: 20,
    alignItems: "center",
  },
  gamertagView: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  gamertagName: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: SIZES.title,
    fontWeight: "bold",
  },
  gamertagText: {
    paddingLeft: 8,
    paddingRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  gamertagaTextLogo: {
    paddingLeft: 8,
    fontWeight: "bold",
  },
});
