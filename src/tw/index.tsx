import React from "react";
import {
  View as RNView,
  Text as RNText,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  TextInput as RNTextInput,
  TouchableHighlight as RNTouchableHighlight,
  StyleSheet,
  ViewProps,
  TextProps,
  TextInputProps,
  PressableProps,
  ScrollViewProps,
  TouchableHighlightProps,
} from "react-native";
import Animated from "react-native-reanimated";

// ─── Utility: merge classNames conditionally ────────────────────────────────
export { clsx as cx } from "clsx";
export { twMerge as twc } from "tailwind-merge";

// ─── View ───────────────────────────────────────────────────────────────────
export type TwViewProps = ViewProps & { className?: string };
export const View = React.forwardRef<RNView, TwViewProps>(
  ({ className, ...props }, ref) => <RNView ref={ref} {...props} />
);
View.displayName = "TwView";

// ─── Text ───────────────────────────────────────────────────────────────────
export type TwTextProps = TextProps & { className?: string };
export const Text = React.forwardRef<RNText, TwTextProps>(
  ({ className, ...props }, ref) => <RNText ref={ref} {...props} />
);
Text.displayName = "TwText";

// ─── ScrollView ──────────────────────────────────────────────────────────────
export type TwScrollViewProps = ScrollViewProps & {
  className?: string;
  contentContainerClassName?: string;
};
export const ScrollView = React.forwardRef<RNScrollView, TwScrollViewProps>(
  ({ className, contentContainerClassName, ...props }, ref) => (
    <RNScrollView ref={ref} {...props} />
  )
);
ScrollView.displayName = "TwScrollView";

// ─── Pressable ───────────────────────────────────────────────────────────────
export type TwPressableProps = PressableProps & { className?: string };
export const Pressable = React.forwardRef<
  React.ElementRef<typeof RNPressable>,
  TwPressableProps
>(({ className, ...props }, ref) => <RNPressable ref={ref} {...props} />);
Pressable.displayName = "TwPressable";

// ─── TextInput ────────────────────────────────────────────────────────────────
export type TwTextInputProps = TextInputProps & { className?: string };
export const TextInput = React.forwardRef<RNTextInput, TwTextInputProps>(
  ({ className, ...props }, ref) => <RNTextInput ref={ref} {...props} />
);
TextInput.displayName = "TwTextInput";

// ─── TouchableHighlight ───────────────────────────────────────────────────────
export type TwTouchableHighlightProps = TouchableHighlightProps & {
  className?: string;
};
export const TouchableHighlight = React.forwardRef<
  React.ElementRef<typeof RNTouchableHighlight>,
  TwTouchableHighlightProps
>(({ className, style, ...props }, ref) => {
  const flat = StyleSheet.flatten(style) || {};
  const { underlayColor, ...restStyle } = flat as any;
  return (
    <RNTouchableHighlight
      ref={ref}
      underlayColor={underlayColor}
      style={restStyle}
      {...props}
    />
  );
});
TouchableHighlight.displayName = "TwTouchableHighlight";

// ─── AnimatedView ────────────────────────────────────────────────────────────
export const AnimatedView = Animated.createAnimatedComponent(RNView);
