import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import styles from "../../constants/Theme/styles/TabsStyles";
import { COLORS } from "../../constants/Theme/theme";

type TabButtonProps = {
  item: {
    route: string;
    label: string;
    IconComponent: any;
    iconName: string;
  };
  onPress: () => void;
  accessibilityState: { selected: boolean };
};

export const TabButton: React.FC<TabButtonProps> = ({
  item,
  onPress,
  accessibilityState,
}) => {
  const { IconComponent, iconName, label } = item;
  const focused = accessibilityState.selected;

  // Valores animados
  const progress = useSharedValue(0);
  const scale = useSharedValue(0);

  const iconColor = COLORS.white;
  const focusedIconColor = COLORS.primary;
  const circleBgColor = COLORS.white;

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, { duration: 350 });
    scale.value = withTiming(focused ? 1 : 0, { duration: 500 });
  }, [focused]);

  // Estilos animados
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolateColor(progress.value, [0, 1], [0, -10]),
        },
      ],
    };
  });

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: circleBgColor,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: progress.value }],
      color: iconColor,
    };
  });

  const animatedIconContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ["transparent", iconColor]
    );
    return {
      borderColor,
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={1}
    >
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <Animated.View style={[styles.btn, animatedIconContainerStyle]}>
          <Animated.View style={[styles.circle, animatedCircleStyle]} />
          <IconComponent
            name={iconName}
            size={24}
            color={focused ? focusedIconColor : iconColor}
          />
        </Animated.View>
        <Animated.Text style={[styles.text, animatedTextStyle]}>
          {label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default TabButton;
