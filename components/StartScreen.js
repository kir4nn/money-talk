import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
} from 'react-native';
import moment from 'moment';
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import PrimaryButton from './PrimaryButton';

function StartScreen({onPressButton, onPressButton1}){
    const [fontsLoaded] = useFonts({
        'CormorantGaramond-Light': require('../assets/fonts/CormorantGaramond-Light.ttf')
    });
    function onPressButtonHandler(){
        onPressButton(true);
        onPressButton1(false);
    }
    function onPressButtonHandler1(){
        onPressButton1(true);
        onPressButton(false);
    }
    if (!fontsLoaded) {
        return null; // Return null or a loading indicator while fonts are loading
      }
    return(
        <View style={styles.inputContainer}>
            <View style={styles.buttonsContainer}>
                <PrimaryButton onPress={onPressButtonHandler1}>spent money</PrimaryButton>
            </View>
            <View style={styles.buttonsContainer1}>    
                <PrimaryButton onPress={onPressButtonHandler}>gave money</PrimaryButton>
            </View>
        </View>
    );
}

export default StartScreen;

const styles=StyleSheet.create({
    inputContainer:{
        flex:1,
    },
    buttonsContainer:{
        flex:1,
        flexDirection:'row',
        marginHorizontal:50,
        padding:50,
        marginTop:250,
        alignContent:'space-between',
        alignItems:'center',
    },
    buttonsContainer1:{
        flex:1,
        flexDirection:'row',
        marginHorizontal:50,
        padding:50,
        alignContent:'space-between',
        alignItems:'center',
        marginBottom:250
    },
})