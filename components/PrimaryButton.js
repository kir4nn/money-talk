import { 
    Pressable, 
    View, 
    Text,
    StyleSheet
} from "react-native";

function PrimaryButton({children, onPress}){

    return(
        <View style={styles.buttonView}>
            <Pressable 
                style={({pressed})=>pressed?[styles.pressableView, styles.pressed]:styles.pressableView} 
                android_ripple={{color:'#9aa0a6'}}
                onPress={onPress}
                >
                <Text style={styles.buttonText}>{children}</Text>
            </Pressable>
        </View>
    )
}

export default PrimaryButton;

const styles=StyleSheet.create({
    buttonView:{
        overflow:'hidden',
        backgroundColor:'#202124',
        borderRadius: 28,
        margin:5,
        elevation:2,
        marginVertical:20
      },
      pressableView:{
      },
    buttonText:{
        color:'#ffffff', 
        fontWeight:'bold',
        textAlign:'center',
        fontSize:20,
        padding:10,
        alignContent:'center',
        alignItems:'center',
        marginHorizontal:50,
        marginVertical:10,
      },
      pressed:{
        opacity:0.75,
      }
})