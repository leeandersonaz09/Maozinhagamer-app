import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../components/Theme/index.js";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "center",
  },
  contentContainer: {
    position: 'relative',
    left: 0, top: -50,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    paddingTop: 40,
},

Tittle: {
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "center",
    //fontSize: fonts.headerTittle
},

subTittle: {
    fontWeight: 'bold',
    fontStyle: "italic",
    textAlign: "justify",
    marginTop: 10

},

Text: {
    marginTop: 5,
    textAlign: 'justify'
},
  subscriberContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  container1: {
    backgroundColor: "red",
    padding: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderColor: "black",
    borderWidth: 1,
  },
  container2: {
    backgroundColor: COLORS.white,
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  subscriberCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerImage: {
    width: "110%",
    height: 180,
  },
  contentContainer: {
    position: "relative",
    left: 0,
    top: -50,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    paddingTop: 40,
  },
  VideoContainer: {
    width: 350, // Largura do card do vídeo
    height: 200, // Altura do card do vídeo
    marginTop: 15,
    justifyContent: "center", // Centraliza o vídeo no card
    alignItems: "center", // Centraliza o vídeo no card
    backgroundColor: COLORS.white, // Cor de fundo do card
    borderRadius: 10, // Bordas arredondadas do card
  },
  video: {
    width: 350, // O vídeo preenche a largura do card
    height: "100%", // O vídeo preenche a altura do card
    marginRight: 20, // Adiciona espaço à direita de cada card
  },

  shortsContainer: {
    width: 350, // Largura do card do vídeo
    height: 200, // Altura do card do vídeo
    marginTop: 20,
    justifyContent: "center", // Centraliza o vídeo no card
    alignItems: "center", // Centraliza o vídeo no card
    backgroundColor: COLORS.white, // Cor de fundo do card
    borderRadius: 10, // Bordas arredondadas do card
  },
  short: {
    width: 350, // O vídeo preenche a largura do card
    height: "100%", // O vídeo preenche a altura do card
    marginRight: 20, // Adiciona espaço à direita de cada card
  },
  list: {
    flexDirection: "row",
  },
});

export default styles;
