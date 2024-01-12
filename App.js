import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StatusBar
} from 'react-native';
import moment from 'moment';
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';

import ToDoItem from './components/ToDoItem';
import ToDoInput from './components/ToDoInput';

import AsyncStorage from '@react-native-async-storage/async-storage';

import OwesMeUI from './components/OwesMeUI';
import StartScreen from './components/StartScreen';
import SpentMoneyUI from './components/SpentMoneyUI';

export default function App() {

  const [screen, setScreen] = useState(<StartScreen onPressButton={onPressedButton} onPressButton1={onPressedButton1}/>);

  function onPressedButton(onPressButtonDesc) {
    if (onPressButtonDesc) {
      setScreen(<OwesMeUI onPressBack={onPressBack} />);
    }
  }

  function onPressedButton1(onPressButtonDesc) {
    if (onPressButtonDesc) {
      setScreen(<SpentMoneyUI onPressBack={onPressBack} />);
    }
  }

  function onPressBack() {
    setScreen(<StartScreen onPressButton={onPressedButton} onPressButton1={onPressedButton1} />);
  }

  const [fontsLoaded] = useFonts({
    'CormorantGaramond-Bold': require('./assets/fonts/CormorantGaramond-Bold.ttf'),
    'CormorantGaramond-Light': require('./assets/fonts/CormorantGaramond-Light.ttf')
  });
  return(
    <View style={styles.rootScreen}>
      <StatusBar backgroundColor='#ffff'/>
      <SafeAreaView style={styles.rootScreen}>
        {screen}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootScreen:{
    flex:1,
    backgroundColor:'black',
    
  },
});
