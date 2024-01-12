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

    function onPressButtonHandler(){
        onPressButton(true);
        onPressButton1(false);
    }
    function onPressButtonHandler1(){
        onPressButton1(true);
        onPressButton(false);
    }

    return(
        <View style={styles.inputContainer}>
            <View style={styles.buttonsContainer}>
                <PrimaryButton onPress={onPressButtonHandler1}>spent money</PrimaryButton>  
                <PrimaryButton onPress={onPressButtonHandler}>gave money</PrimaryButton>
            </View>
        </View>
    );
}

export default StartScreen;

const styles=StyleSheet.create({
    inputContainer:{
        flex:1,
        alignItems:'center',
    },
    buttonsContainer:{
        marginTop:'70%',
        },
})