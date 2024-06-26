import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../theme";
import metrics from "../metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 40,
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 5,
    paddingLeft: 10,
  },
  SectionStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    height: 40,
    borderRadius: 20,
    margin: 10,
  },
  containerList: {
    flex: 1,
    paddingHorizontal: 15, // Adiciona um padding horizontal de 20px
    paddingVertical: 10, // Adiciona um padding vertical de 10px
    paddingBottom: 80, //Adiciona um padding no fim do conteiner
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
    fontSize: 14,
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
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default styles;
