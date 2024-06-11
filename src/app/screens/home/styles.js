import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
      },
      VideoContainer:{
        flex:1,
        marginTop:15,
        width:300,
        height:100,
      },
      video: {
        width: 100, // Largura do vídeo
        height: 50, // Altura do vídeo
        margin: 10,
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