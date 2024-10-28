import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES } from "../theme.js";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "center",
    backgroundColor: COLORS.white,
  },

  //Header Image
  headerImage: {
    width: "110%",
    height: 200,
  },
  contentContainer: {
    position: "relative",
    left: 0,
    top: -45,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    paddingTop: 10,
  },

  //Conteudo de inscritos
  subscribeView: {
    alignItems: "center",
    flex: 1,
  },
  subscriberContainer: {
    flexDirection: "row",
    marginTop: -20,
    //marginBottom: 10,
  },

  //Loading

  loadingView: {
    marginTop: 10,
  },

  list: {
    flexDirection: "row",
  },

  //Banner

  BannerTittle: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    fontWeight: "bold",
    fontSize: 18,
  },

  //renderItems
  WidgetsTittle: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    fontWeight: "bold",
    fontSize: 18,
  },
  WigtesContainer: {
    flex: 1,
    padding: 15,
    marginTop: -20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 65,
  },

  // SmallList
  SmallListContainer: {
    flex: 1,
    //backgroundColor: "#5486",
    paddingLeft: 10,
  },
  SmallListTittle: {
    paddingHorizontal: 5,
    paddingBottom: 10,
    fontWeight: "bold",
    fontSize: 18,
  },
  Sitem: {
    margin: 10,
    paddingTop: -15,
    alignSelf: "center",
    width: 200,
    height: 128,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  SitemPhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  StextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.5)",
  },
  SitemText: {
    color: "white",
    marginHorizontal: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textOutlineColor: "black", // Cor da borda
    textOutlineWidth: 2, // Largura da borda
  },
});

export default styles;
