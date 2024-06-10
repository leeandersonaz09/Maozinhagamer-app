import { StyleSheet} from 'react-native';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:"center",
    },
    tabBar:{
        position:"absolute",
        height:70,
        bottom:24,
        right:16,
        left:16,
        borderRadius:16,
        backgroundColor:COLORS.primary,
        borderTopWidth:1
    },
    btn:{
        width:50,
        height:50,
        borderWidth:4,
        borderRadius:25,
        backgroundColor:"transparent",
        justifyContent:"center",
        alignItems:"center",
    },
    text:{
        fontSize:10,
        textAlign:"center",
        color: COLORS.white
    }

})

export default styles;