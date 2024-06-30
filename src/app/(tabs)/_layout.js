import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, TouchableOpacity, View } from "react-native";
import {
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import * as Animatable from "react-native-animatable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import styles from "../Theme/styles/TabsStyles.js";

import {
  COLORS,
  animate1,
  animate2,
  circle1,
  circle2,
} from "../Theme/theme.js";

const TabArr = [
  {
    route: "index",
    label: "Inicio",
    icon: <AntDesign name="home" size={24} color="white" />,
  },
  {
    route: "patrocinador",
    label: "Patrocinador",
    icon: <MaterialCommunityIcons name="offer" size={24} color="white" />,
  },
  {
    route: "members",
    label: "Membros",
    icon: <Octicons name="people" size={24} color="white" />,
  },
  {
    route: "about",
    label: "Sobre",
    icon: <MaterialIcons name="support-agent" size={24} color="white" />,
  },
];

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;

  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate(animate1);
      circleRef.current.animate(circle1);
      textRef.current.transitionTo({ scale: 1 });
    } else {
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
      textRef.current.transitionTo({ scale: 0 });
    }
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={1}
    >
      <Animatable.View ref={viewRef} duration={500} style={styles.container}>
        <View
          style={[
            styles.btn,
            {
              borderColor: focused ? COLORS.white : COLORS.primary,
            },
          ]}
        >
          <Animatable.View
            ref={circleRef}
            duration={500}
            style={styles.circle}
          />
          {item.icon}
        </View>
        <Animatable.Text ref={textRef} duration={500} style={styles.text}>
          {item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

export default function TabRoutesLayout() {
  return (
    <>
      <GestureHandlerRootView>
        <SafeAreaView style={{ flex: 1 }}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: styles.tabBar,
              keyboardHidesTabBar: true,
            }}
          >
            {TabArr.map((item, index) => {
              return (
                <Tabs.Screen
                  key={index}
                  name={item.route}
                  options={{
                    tabBarShowLabel: false,
                    tabBarButton: (props) => (
                      <TabButton {...props} item={item} />
                    ),
                  }}
                ></Tabs.Screen>
              );
            })}
          </Tabs>
        </SafeAreaView>
      </GestureHandlerRootView>
    </>
  );
}
