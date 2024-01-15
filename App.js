import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OwesMeUI from './components/OwesMeUI';
import StartScreen from './components/StartScreen';
import SpentMoneyUI from './components/SpentMoneyUI';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import HistoryUI from './components/HistoryUI';
import { HistoryProvider } from './components/HistoryContext';
import { GaveHistoryProvider } from './components/GaveHistoryContext';

const Stack=createNativeStackNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    'CormorantGaramond-Light': require('./assets/fonts/CormorantGaramond-Light.ttf'),
    'CormorantGaramond-Bold': require('./assets/fonts/CormorantGaramond-Bold.ttf')
  });
  if(!fontsLoaded){
    return <AppLoading />;
  }
  return (
    <View style={styles.rootScreen}>
      <StatusBar style='light' />
      <SafeAreaView style={styles.rootScreen}>
        <NavigationContainer>
          <HistoryProvider>
            <GaveHistoryProvider>
              <Stack.Navigator>
                <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }} />
                <Stack.Screen name="SpentMoneyScreen" component={SpentMoneyUI} options={{ headerShown: false }} />
                <Stack.Screen name="GaveMoneyScreen" component={OwesMeUI} options={{ headerShown: false }} />
                <Stack.Screen name="HistoryScreen" component={HistoryUI} options={{ headerShown: false }} />
              </Stack.Navigator>
            </GaveHistoryProvider>
          </HistoryProvider>
        </NavigationContainer>
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
