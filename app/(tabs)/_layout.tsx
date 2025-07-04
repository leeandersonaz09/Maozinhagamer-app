import { Tabs } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
  Text,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { Svg, Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// --- 1. CONFIGURAÇÃO (Ícones e Cores) ---

const COLORS = {
  // Fundo da TabBar: um cinza-carvão quase preto.
  background: "#1A1A1A",
  // Cor do conteúdo (ícones, texto).
  content: "#EFEFEF",
  // A cor de destaque: o 'vermelho vinho' / 'vermelho sangue'.
  accent: "#C62828",
  // O tom mais escuro do vermelho para o gradiente.

  accentDark: "#8E0000",
  // Sombra para o brilho da borda.
  shadow: "#C62828",
};

// Ícones como componentes SVG para melhor controle
const ICONS = {
  home: (p: { color: string }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        fill={p.color}
        d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"
      />
    </Svg>
  ),
  handshake: (p: { color: string }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        fill={p.color}
        d="M18.9 12.4c.5-1.1.2-2.5-.8-3.3l-2.2-1.9c-.6-.5-1.5-.6-2.2-.1L12 8.4V11h2c1 0 1.9.7 2.2 1.6.3.9.1 1.9-.5 2.6l-2.4 2.8c-.8.9-2.1 1.1-3.2.4L6.9 16c-1.1-.6-1.6-1.8-1.2-2.9l.4-1.2c.2-.5.5-.9 1-1.2L9 9.4V6H7c-1 0-1.9-.7-2.2-1.6C4.5 3.5 4.7 2.5 5.3 1.8L7.7.5c.8-.9 2.1-1.1 3.2-.4L14.1 2c1.1.6 1.6 1.8 1.2 2.9l-.4 1.2c-.2.5-.5.9-1 1.2L12 8.6V11h2c.8 0 1.5.3 2 .8l2.1 1.9c.5.4.7 1 .7 1.6v.5h-1.6l-2.1-1.9c-.5-.4-1.1-.6-1.7-.6h-2V8.9c0-.4.2-.8.5-1l1.8-1.3c.4-.3.5-.8.3-1.2l-.4-1.2c-.2-.6-.9-1-1.5-.7L7.9 5.8c-.6.4-1 .9-1.2 1.5l-.4 1.2c-.2.6.1 1.2.7 1.5l3.1 1.5c.3.2.5.5.5.9v7.1c0 .4-.2.8-.5 1l-1.8 1.3c-.4.3-.5.8-.3 1.2l.4 1.2c.2.6.9 1 1.5.7l3.2-1.8c.6-.4 1-.9 1.2-1.5l.4-1.2c-.1-.6-.4-1.1-.8-1.4z"
      />
    </Svg>
  ),
  people: (p: { color: string }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        fill={p.color}
        d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V18h14v-1.5c0-2.3-4.7-3.5-7-3.5zm8 0c-.3 0-.6 0-.9.1 1.2.8 2 1.9 2 3.4V18h6v-1.5c0-2.3-4.7-3.5-7-3.5z"
      />
    </Svg>
  ),
  about: (p: { color: string }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        fill={p.color}
        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
      />
    </Svg>
  ),
};

// Mapa para associar rotas com nossos ícones e labels
const ROUTE_CONFIG = {
  index: { label: "Início", icon: ICONS.home },
  patrocinador: { label: "Parceiros", icon: ICONS.handshake },
  members: { label: "Membros", icon: ICONS.people },
  about: { label: "Sobre", icon: ICONS.about },
};

// --- 2. NOSSA TABBAR CUSTOMIZADA ---

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [layouts, setLayouts] = useState<
    Record<number, { x: number; width: number }>
  >({});

  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  React.useEffect(() => {
    const targetLayout = layouts[state.index];
    if (targetLayout) {
      const springConfig = { damping: 18, stiffness: 150 };
      indicatorPosition.value = withSpring(targetLayout.x, springConfig);
      indicatorWidth.value = withSpring(targetLayout.width, springConfig);
    }
  }, [state.index, layouts]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    width: indicatorWidth.value,
    transform: [{ translateX: indicatorPosition.value }],
  }));

  return (
    <LinearGradient
      colors={[COLORS.accent, COLORS.accentDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.tabBarWrapper}
    >
      <View style={styles.tabBarContainer}>
        <Animated.View
          style={[styles.slidingIndicator, animatedIndicatorStyle]}
        >
          <LinearGradient
            colors={[COLORS.accent, COLORS.accentDark]}
            style={styles.indicatorGradient}
          />
        </Animated.View>

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const config =
            ROUTE_CONFIG[route.name as keyof typeof ROUTE_CONFIG] ?? {};
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const progress = useSharedValue(isFocused ? 1 : 0);
          React.useEffect(() => {
            progress.value = withSpring(isFocused ? 1 : 0, {
              damping: 15,
              stiffness: 120,
            });
          }, [isFocused]);

          const animatedIconStyle = useAnimatedStyle(() => ({
            transform: [
              { translateY: interpolate(progress.value, [0, 1], [0, -12]) },
            ],
          }));
          const animatedLabelStyle = useAnimatedStyle(() => ({
            opacity: interpolate(progress.value, [0, 1], [0, 1]),
            transform: [
              { translateY: interpolate(progress.value, [0, 1], [10, 0]) },
            ],
          }));

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLayout={(event) => {
                const { x, width } = event.nativeEvent.layout;
                setLayouts((prev) => ({ ...prev, [index]: { x, width } }));
              }}
              style={styles.tabButton}
            >
              <Animated.View style={animatedIconStyle}>
                {config.icon ? config.icon({ color: COLORS.content }) : null}
              </Animated.View>
              <Animated.Text style={[styles.tabLabel, animatedLabelStyle]}>
                {config.label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </LinearGradient>
  );
}

// --- 3. COMPONENTE PRINCIPAL DO LAYOUT ---

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "black" }}>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="patrocinador" />
        <Tabs.Screen name="members" />
        <Tabs.Screen name="about" />
      </Tabs>
    </GestureHandlerRootView>
  );
}

// --- 4. ESTILOS ---

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    height: 75,
    borderRadius: 37.5,
    padding: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 20,
  },
  tabBarContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: 35.5,
    alignItems: "center",
    paddingHorizontal: 10,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    position: "absolute",
    bottom: 8,
    color: COLORS.content,
    fontSize: 12,
    fontWeight: "bold",
  },
  slidingIndicator: {
    position: "absolute",
    top: 10,
    height: 55,
    borderRadius: 27.5,
  },
  indicatorGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 27.5,
  },
});
