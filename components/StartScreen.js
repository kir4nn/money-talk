import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text
} from 'react-native';
import PrimaryButton from './PrimaryButton';
import { Ionicons, FontAwesome} from '@expo/vector-icons';

function StartScreen({navigation}){

    function onPressSpent(){
        navigation.navigate('SpentMoneyScreen')
    }
    
    function onPressGave(){
        navigation.navigate('GaveMoneyScreen')
    }

    function onPressHistory(){
        navigation.navigate('HistoryScreen')
    }


    return(
        <View style={styles.inputContainer}>
            <View style={styles.imgContainer}>
                <Image source={require('../assets/images/icon.png')} style={{width:180, height:180}}/>
                <Text style={styles.titleText}>money talk</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <PrimaryButton onPress={onPressSpent}>spent money {''}
                  <Ionicons name="fast-food-outline" size={24} color="white" />
                </PrimaryButton>  
                <PrimaryButton onPress={onPressGave}>gave money{' '}
                    <FontAwesome name="arrows-h" size={24} color="white" />
                </PrimaryButton>
                <PrimaryButton onPress={onPressHistory}>history{' '}
                    <FontAwesome name="history" size={24} color="white" />
                </PrimaryButton>
            </View>
        </View>
    );
}

export default StartScreen;

const styles=StyleSheet.create({
    inputContainer:{
        flex:1,
        alignItems:'center',
        backgroundColor: 'black',
    },
    imgContainer:{
        marginTop:'5%',
        alignItems:'center'
    },
    titleText:{
        color:'white',
        fontFamily:'CormorantGaramond-Bold',
        fontSize:32,   
    },
    buttonsContainer:{
        marginTop:'5%'
    }
})