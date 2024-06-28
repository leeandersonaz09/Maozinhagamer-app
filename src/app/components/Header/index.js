import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
//import {colors} from '../../styles';
import { COLORS, SIZES } from "../../Theme/theme";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function Header(props) {
  const tittle = props.HeaderTittle;
  const route = props.href;
  return (
    <>
      <View style={styles.header}>
        {props.children}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {route ? (
            <View style={{}}>
              <Link href={route} asChild>
                <TouchableOpacity style={{ paddingLeft: 14 }}>
                  <FontAwesome
                    name="arrow-circle-left"
                    size={38}
                    color="white"
                  />
                </TouchableOpacity>
              </Link>
            </View>
          ) : (
            <></>
          )}
          <View
            style={{
              flex: 1,
              textAlign: "center",
              alignItems: "center",
              paddingRight: 40,
            }}
          >
            <Text style={styles.HeaderTittle}>{tittle}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    width: "100%",
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  HeaderTittle: {
    fontSize: SIZES.headerTittle,
    color: COLORS.white,
  },
});
