import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      },
      video: {
        width: 500, // Largura do vídeo
        height: 100, // Altura do vídeo
        margin: 100,
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