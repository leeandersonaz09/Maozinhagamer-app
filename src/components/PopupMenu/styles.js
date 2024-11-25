import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../Theme/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: COLORS.playstation,
  },
  followButton: {
    padding: 8,
    marginTop: 10,
  },
  popup: {
    borderRadius: 8,
    borderColor: "#333",
    borderWidth: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    position: "absolute",
    top: 30,
    right: 20,
    alignItems: "center",
  },
  gamertagView: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  gamertagName: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: SIZES.title,
    fontWeight: "bold",
  },
  gamertagText: {
    paddingLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
