import { Dimensions, Platform } from "react-native";
export const COLORS = {
  primary: "rgba(220,20,60,1)",
  transparent: "rgba(255, 255, 255, 0.1);",
  white: "#FFFFFF",
  black: "#111111",
  statusbar: "#2E0000",
  header: "#333333",
  gray: "#d8d8d8",
  white: "#fff",
  yellow: "#ffcc00",
  black: "#000",
  blue: "#483d8b",
  text: "#000",
  background: "#fff",
  card: "#fff",
  //SOCIAL MIDIA COLOR
  facebook: "#4267B2",
  whatsapp: "#128C7E",
  discord: "#7289da",
  youtube: "#CD201F",
  instagram: "#c13584",
  pix: "#48beae",
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 30,
  padding: 12,

  // FONT SIZES
  h1: 32,
  h2: 26,
  h3: 22,
  title: 20,
  body1: 30,
  body2: 22,
  body3: 16,
  input: 16,
  regular: 15,
  medium: 12,
  small: 11,
  tiny: 10,
  headerTittle: 18,
  header: 20,
  big: 38,

  // App Dimensions
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

export const FONTS = {
  largeTitle: {
    fontFamily: "black",
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
  },
  h1: { fontFamily: "bold", fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: "bold", fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: "bold", fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: "bold", fontSize: SIZES.h4, lineHeight: 20 },
  body1: { fontFamily: "regular", fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontFamily: "regular", fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontFamily: "regular", fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontFamily: "regular", fontSize: SIZES.body4, lineHeight: 20 },
};

export const animate1 = {
  0: { scale: 0.5, translateY: 7 },
  0.92: { translateY: -34 },
  1: { scale: 1.2, translateY: -24 },
};
export const animate2 = {
  0: { scale: 1.2, translateY: -24 },
  1: { scale: 1, translateY: 7 },
};
export const circle1 = {
  0: { scale: 0 },
  0.3: { scale: 0.9 },
  0.5: { scale: 0.2 },
  0.8: { scale: 0.7 },
  1: { scale: 1 },
};
export const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } };

const appTheme = {
  COLORS,
  SIZES,
  FONTS,
  animate1,
  animate2,
  circle1,
  circle2,
};

export default appTheme;
