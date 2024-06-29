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
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../Theme/theme";
//import styles from "./styles";

const PopupMenu = (props) => {
  const { name, gamertag, icon, color } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const scale = useRef(new Animated.Value(0)).current;
  const [alertMessage, setAlertMessage] = useState("");

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
              ]}
            >
              {alertMessage && (
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.primary,
                    textAlign: "center",
                  }}
                >
                  {alertMessage}
                </Text>
              )}
              <Text style={styles.gamertagName}>{name}</Text>
              <View style={styles.gamertagView}>
                <FontAwesome5 name={icon} size={24} color={color} />
                <Text style={styles.gamertagText}>{gamertag}</Text>
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
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    position: "absolute",
    top: 30,
    right: 20,
    alignItems: "center",
  },
  gamertagView: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  gamertagName: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: SIZES.title,
    fontWeight: "bold",
  },
  gamertagText: {
    paddingLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});
