import React from "react";
import { View, StyleSheet } from "react-native";

export default function Separator(props) {
  return (
    <>
      <View style={styles.separator}>{props.children}</View>
    </>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: "100%",
    borderTopWidth: 1,
    borderColor: "#C0C0C0",
    marginTop: 6,
    padding: 10,
  },
});
