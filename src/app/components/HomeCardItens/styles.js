import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
import { COLORS } from "../../Theme/theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 15,
    width: (width - 45) / 2,
    borderRadius: 10,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  TextImageContainer: {
    alignContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },

  darkOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: 180,
    backgroundColor: COLORS.black,
    opacity: 0.5,
    borderRadius: 10,
  },

  Icon: {
    fontSize: 50,
    color: COLORS.white,
    alignContent: "center",
    alignSelf: "center",
  },

  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    borderRadius: 10,
  },

  TextImage: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },

  separatorContainer: {
    borderTopWidth: 1,
    borderColor: "#C0C0C0",
    marginTop: 6,
    padding: 10,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  price: {
    textAlign: "center",
    color: "#C0C0C0",
    textDecorationLine: "line-through",
    fontSize: 12,
  },
  priceOff: {
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
    color: "#ff5b77",
  },
});

export default styles;
