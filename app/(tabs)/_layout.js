import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Platform, SafeAreaView, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import styles from "../../constants/Theme/styles/TabsStyles";
import { COLORS, animations } from "../../constants/Theme/theme";
import {
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  Octicons,
} from "@expo/vector-icons";

const TabArr = [
  {
    route: "index",
    label: "Inicio",
    icon: <AntDesign name="home" size={24} color="white" />,
  },
  {
    route: "patrocinador",
    label: "Parceiros",
    icon: <FontAwesome5 name="handshake" size={24} color="white" />,
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
      viewRef.current.animate(animations.animate1);
      circleRef.current.animate(animations.circle1);
      textRef.current.transitionTo({ scale: 1 });
    } else {
      viewRef.current.animate(animations.animate2);
      circleRef.current.animate(animations.circle2);
      textRef.current.transitionTo({ scale: 0 });
    }
  }, [focused]);

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
            { borderColor: focused ? COLORS.white : COLORS.primary },
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

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            keyboardHidesTabBar: true,
          }}
        >
          {TabArr.map((item, index) => (
            <Tabs.Screen
              key={index}
              name={item.route}
              options={{
                tabBarShowLabel: false,
                tabBarButton: (props) => <TabButton {...props} item={item} />,
              }}
            />
          ))}
        </Tabs>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
