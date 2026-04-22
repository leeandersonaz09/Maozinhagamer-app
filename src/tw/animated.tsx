import RNAnimated from "react-native-reanimated";
import { View, ScrollView } from "./index";

export const Animated = {
  ...RNAnimated,
  View: RNAnimated.createAnimatedComponent(View),
  ScrollView: RNAnimated.createAnimatedComponent(ScrollView),
};
