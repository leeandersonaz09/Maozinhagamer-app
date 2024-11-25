import { StyleSheet, Dimensions } from "react-native";
import { COLORS, SIZES } from "../theme.js";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // Header Image
  headerImage: {
    width: "100%",
    height: height * 0.25, // Proporcional à tela
    resizeMode: "cover", // Evita distorção
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
    elevation: 4, // Suporte para sombras no Android
  },

  // Conteudo de inscritos
  subscribeView: {
    alignItems: "center",
    flex: 1,
  },

  // Loading
  loadingView: {
    marginTop: 10,
  },

  // Banner
  BannerTittle: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    fontWeight: "bold",
    fontSize: 18,
  },

  // Título da seção de widgets
  WidgetsTittle: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    fontWeight: "bold",
    fontSize: 18,
  },

  // Container para os widgets
  WigtesContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10, // Substitui a margem negativa
    flexDirection: "column",
    justifyContent: "space-around",
    marginBottom: 65,
  },

  // Estilo para TouchableOpacity ao redor de cada card
  cardTouchable: {
    margin: 8, // Define o espaçamento entre os cards
    flex: 1,
  },

  // SmallList
  SmallListContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  SmallListTittle: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    fontWeight: "bold",
    fontSize: 18,
  },
  Sitem: {
    margin: 5,
    alignSelf: "center",
    width: 200,
    height: 80,
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
  },
});

export default styles;
