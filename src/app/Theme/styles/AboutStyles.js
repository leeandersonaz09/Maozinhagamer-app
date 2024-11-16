import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../theme";
import metrics from "../metrics";

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },

  headerTitle: {
    fontSize: SIZES.header,
    color: COLORS.white,
    fontWeight: "bold",
  },

  HeaderBackGround: {
    height: 70,
    width: metrics.screenWidth,
    backgroundColor: COLORS.primary,
  },

  svgCurve: {
    position: "absolute",
    width: metrics.screenWidth,
  },

  Content: {
    marginHorizontal: 10,
    marginTop: -50,
  },

  CardContent: {
    flexDirection: "row",
  },

  TextContent: {
    marginLeft: 12,
    flex: 1,
  },

  title: {
    fontWeight: "bold",
    fontSize: SIZES.header,
  },

  CardContainer: {
    flexDirection: "row",
  },
  Image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginTop: 10,
    resizeMode: "cover",
  },
  text: {
    textAlign: "auto",
  },

  Icon: {
    //fontSize: 45,
    //color: COLORS.blue
  },
});

export default styles;
