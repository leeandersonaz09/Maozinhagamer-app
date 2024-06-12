import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { COLORS } from '../../components/theme';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
      },
      VideoContainer:{
        width:350, // Largura do card do vídeo
        height: 200, // Altura do card do vídeo
        marginTop: 60,
        justifyContent: 'center', // Centraliza o vídeo no card
        alignItems: 'center', // Centraliza o vídeo no card
        backgroundColor: COLORS.white, // Cor de fundo do card
        borderRadius: 10, // Bordas arredondadas do card
      },
      video: {
        width: 350, // O vídeo preenche a largura do card
        height: '100%', // O vídeo preenche a altura do card
        //resizeMode:"contain"
        marginRight: 20, // Adiciona espaço à direita de cada card
      },
      list: {
        flexDirection: 'row',
      },
      tabBar:{
        position:"absolute",
        height:70,
        bottom:24,
        right:16,
        left:16,
        borderRadius:16,
        backgroundColor:"#fffff"
    }

})

export default styles;