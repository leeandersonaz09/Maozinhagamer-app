import React, { useState, useEffect } from "react";
import { View, Text, Modal, SafeAreaView } from "react-native";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { COLORS } from "../../Theme/theme";
import styles from "./styles";

const PopupMenu = (props) => {
  const [modalVisible, setModalVisible] = useState(true);

  const options = [
    {
      id: 1,
      name: "Edit",
      gamertag: "EDIT",
      icon: <FontAwesome6 size={40} color={COLORS.discord} name="discord" />,
      action: null,
    },
  ];

  return (
    <>
      <Modal transparent visible={modalVisible}>
        <SafeAreaView
          style={styles.container}
          onTouchStart={() => setModalVisible(false)}
        >
          <View>
            {options.map((options, index) => {
              <Text>{options.name}</Text>;
              {
                options.icon;
              }
            })}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default PopupMenu;
