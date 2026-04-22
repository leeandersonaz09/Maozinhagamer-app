import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type AnimatedBrandSplashProps = {
  onFinish: () => void;
};

const BACKGROUND_COLOR = "#2E0000";
const HIGHLIGHT_COLOR = "#F23A3A";
const LOGO_SOURCE = require("../assets/images/splash-icon.png");

export function AnimatedBrandSplash({ onFinish }: AnimatedBrandSplashProps) {
  const { width } = useWindowDimensions();
  const logoSize = useMemo(() => Math.min(width * 0.58, 240), [width]);

  const screenOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.72)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;
  const ringProgress = useRef(new Animated.Value(0)).current;
  const sweepProgress = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const finished = useRef(false);

  useEffect(() => {
    const finishOnce = () => {
      if (finished.current) {
        return;
      }

      finished.current = true;
      onFinish();
    };

    const fallback = setTimeout(finishOnce, 3200);

    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          damping: 12,
          stiffness: 130,
          mass: 0.85,
          useNativeDriver: true,
        }),
        Animated.timing(ringProgress, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(logoFloat, {
          toValue: 1,
          duration: 620,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sweepProgress, {
          toValue: 1,
          duration: 780,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 360,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(380),
      Animated.parallel([
        Animated.timing(screenOpacity, {
          toValue: 0,
          duration: 360,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1.08,
          duration: 360,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start(({ finished: didFinish }) => {
      clearTimeout(fallback);
      if (didFinish) {
        finishOnce();
      }
    });

    return () => {
      clearTimeout(fallback);
      animation.stop();
    };
  }, [
    logoFloat,
    logoOpacity,
    logoScale,
    onFinish,
    ringProgress,
    screenOpacity,
    sweepProgress,
    textOpacity,
  ]);

  const ringScale = ringProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.72, 1.75],
  });

  const ringOpacity = ringProgress.interpolate({
    inputRange: [0, 0.32, 1],
    outputRange: [0, 0.55, 0],
  });

  const logoTranslateY = logoFloat.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -10, 0],
  });

  const sweepTranslateX = sweepProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-logoSize, logoSize],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { opacity: screenOpacity }]}
    >
      <View style={[styles.logoStage, { width: logoSize, height: logoSize }]}>
        <Animated.View
          style={[
            styles.ring,
            {
              width: logoSize * 0.92,
              height: logoSize * 0.92,
              borderRadius: logoSize,
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.logoCard,
            {
              width: logoSize,
              height: logoSize,
              borderRadius: logoSize * 0.2,
              opacity: logoOpacity,
              transform: [{ scale: logoScale }, { translateY: logoTranslateY }],
            },
          ]}
        >
          <Image source={LOGO_SOURCE} style={styles.logo} resizeMode="contain" />
          <Animated.View
            style={[
              styles.sweep,
              {
                transform: [
                  { translateX: sweepTranslateX },
                  { rotate: "18deg" },
                ],
              },
            ]}
          />
        </Animated.View>
      </View>

      <Animated.View style={[styles.caption, { opacity: textOpacity }]}>
        <Text style={styles.title}>Maozinha Gamer</Text>
        <View style={styles.accent} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    zIndex: 10000,
  },
  logoStage: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    borderColor: "rgba(242, 58, 58, 0.9)",
    borderWidth: 2,
    position: "absolute",
  },
  logoCard: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.18)",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: {
    height: "86%",
    width: "86%",
  },
  sweep: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    bottom: -40,
    position: "absolute",
    top: -40,
    width: 42,
  },
  caption: {
    alignItems: "center",
    gap: 12,
    marginTop: 28,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  accent: {
    backgroundColor: HIGHLIGHT_COLOR,
    borderRadius: 999,
    height: 4,
    width: 88,
  },
});
