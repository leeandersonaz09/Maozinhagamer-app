import { StyleSheet } from "react-native";
import { COLORS } from "../../Theme/theme";

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
    width: 200, // ajuste o valor de acordo com a largura do seu ícone
    alignItems: "center",
  },
  gamertagView: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  gamertagView: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  gamertagText: {
    paddingLeft: 8,
  },
});

export default styles;
