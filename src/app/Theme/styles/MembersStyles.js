import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../theme";
import metrics from "../metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerList: {
    flex: 1,
    paddingHorizontal: 15, // Adiciona um padding horizontal de 20px
    paddingVertical: 10, // Adiciona um padding vertical de 10px
    paddingBottom: 80, //Adiciona um padding no fim do conteiner
  },
  memberContainer: {
    flex: 1,
    margin: 10, // Adiciona um margin de 10px em todos os lados
    padding: 10, // Adiciona um padding de 10px em todos os lados
    backgroundColor: "white",
    borderRadius: 10,
  },
  memberImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    alignSelf: "center",
  },
  memberInfo: {
    alignItems: "center",
    marginTop: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  memberTitle: {
    fontSize: 14,
    color: "gray",
  },
  memberFollowers: {
    fontSize: 12,
  },
  memberTagsContainer: {
    flexDirection: "row",
  },
  followButton: {
    padding: 8,
    marginTop: 10,
  },
  followButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default styles;
