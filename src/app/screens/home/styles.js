import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../components/Theme/index.js';
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
        marginRight: 20, // Adiciona espaço à direita de cada card
    },
    
    shortsContainer: {
        width:350, // Largura do card do vídeo
        height: 200, // Altura do card do vídeo
        marginTop: 20,
        justifyContent: 'center', // Centraliza o vídeo no card
        alignItems: 'center', // Centraliza o vídeo no card
        backgroundColor: COLORS.white, // Cor de fundo do card
        borderRadius: 10, // Bordas arredondadas do card
    },
    short: {
        width: 350, // O vídeo preenche a largura do card
        height: '100%', // O vídeo preenche a altura do card
        marginRight: 20, // Adiciona espaço à direita de cada card
    },
    list: {
        flexDirection: 'row',
    },
   
})

export default styles;
