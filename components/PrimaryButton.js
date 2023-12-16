import { 
    Pressable, 
    View, 
    Text,
    StyleSheet
} from "react-native";
import React, { 
    useState,
    useEffect
  } from "react";
import { useFonts } from "expo-font";

function PrimaryButton({children, onPress}){
    const [fontsLoaded] = useFonts({
        'CormorantGaramond-Bold': require('../assets/fonts/CormorantGaramond-Bold.ttf')
      });

    if(!fontsLoaded)
      return null;

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
        width:'20%',
        margin:5,
        elevation:2,
        flex:1,
      },
      pressableView:{

      },
    buttonText:{
        fontFamily:'CormorantGaramond-Bold',
        color:'#ffffff', 
        fontWeight:'bold',
        paddingVertical: 16,
        paddingHorizontal: 32,
        textAlign:'center',
        fontSize:20,
      },
      pressed:{
        opacity:0.75,
      }
})