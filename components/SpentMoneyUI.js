import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert
} from 'react-native';
import moment from 'moment';
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';

import ToDoItem from './ToDoItem';
import ToDoInput from './ToDoInput';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SecondaryButton from './SecondaryButton';
import SpentInput from './SpentInput';
import SpentItem from './SpentItem';


function SpentMoneyUI({ onPressBack }){
  const [splashIsVisible, setSplashIsVisible] = useState(true);
  const [todoTexts, setToDoTexts] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);
  
  function handlePressBack() {
    if (onPressBack) {
      onPressBack();
    }
  }


  const [fontsLoaded] = useFonts({
    'CormorantGaramond-Light': require('../assets/fonts/CormorantGaramond-Light.ttf')
  });

  useEffect(() => {
    const loadResources = async () => {
      await SplashScreen.preventAutoHideAsync();

      // Load fonts and other resources
      if (fontsLoaded) {
        setSplashIsVisible(false);
        await SplashScreen.hideAsync();
      }
    };

    loadResources();
  }, [fontsLoaded]);
  
  const [lastResetDate, setLastResetDate] = useState('');

useEffect(() => {
  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('spentmoni');
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos);
        setToDoTexts(parsedTodos);

        const initialTotal = parsedTodos.reduce((total, todo) => {
          const money = parseInt(todo.text.split(':')[0].replace('₹', ''), 10);
          return total + money;
        }, 0);
        setTotalMoney(initialTotal);

        // Find the most recent item and set its date as the last reset date
        if (parsedTodos.length > 0) {
          const mostRecentDate = parsedTodos[0].date; // Assuming the date is in the format "MMM D"
          setLastResetDate(mostRecentDate);

          // Check if last reset date's month was last month
          const lastResetDateMoment = moment(mostRecentDate, "MMM D");
          const currentMonthStart = moment().startOf('month');
          
          if (lastResetDateMoment.isBefore(currentMonthStart)) {
            // Reset totalMoney on the first day of the current month
            setTotalMoney(0);
          }
        } else {
          // If there are no stored todos, set lastResetDate to the current date
          setLastResetDate(moment().format("MMM D"));
        }
      } else {
        // If there are no stored todos, set lastResetDate to the current date
        setLastResetDate(moment().format("MMM D"));
      }
    } catch (error) {
      console.error('Error loading spentmoni:', error);
    }
  };

  loadTodos();
}, []);

  const saveTodos = async (spentmoni) => {
    try {
      await AsyncStorage.setItem('spentmoni', JSON.stringify(spentmoni));
    } catch (error) {
      console.error('Error saving spentmoni:', error);
    }
  };
  


  function addToDoHandler(enteredToDoText, enteredMoney, enteredRecepient) {
    
    if(isNaN(enteredMoney)||enteredMoney<=0||enteredMoney.startsWith(".")||enteredMoney.startsWith(",")){
      Alert.alert(
          'invalid number', 
          'money is null or has special char',
          [{text:'okay', style:'destructive'}]
      )
      return;
    }

    if (enteredMoney && enteredRecepient !== '') {
      const money = parseInt(enteredMoney, 10);
      const currentDate = moment().format("MMM D");

      const newToDo = {
        text: `₹${enteredMoney}: ${enteredRecepient}, ${enteredToDoText}`,
        id: Math.random().toString(),
        date: currentDate,
      };

      setToDoTexts((currentToDoTexts) => [newToDo, ...currentToDoTexts]);
      saveTodos([newToDo, ...todoTexts]);
      setTotalMoney((currentTotal) => currentTotal + money);
    }
  }

  useEffect(() => {
    const resetMonth = () => {
      setLastResetDate(moment().format("YYYY-MM-DD"));
    };

    const interval = setInterval(resetMonth, 86400000); // Check every day

    return () => clearInterval(interval);
  }, []);

  function deleteToDoHandler(id) {
    setToDoTexts((currentToDoTexts) => {
      const updatedTodos = currentToDoTexts.filter((todo) => todo.id !== id);
      saveTodos(updatedTodos);
  
      const newTotal =
        updatedTodos.length === 0
          ? 0
          : updatedTodos.reduce((total, todo) => {
              const todoMoney = parseInt(todo.text.split(':')[0].replace('₹', ''), 10);
              return total + todoMoney;
            }, 0);
      setTotalMoney(newTotal);
  
      return updatedTodos;
    });
  }

  const day = moment().format('dddd').toLowerCase();

  if (splashIsVisible) {
    return <View style={styles.splashScreen} />;
  }

  return (
    <View style={styles.appContainer}>
      <View>
        <Text style={styles.dateContainer}>{day}.</Text>
      </View>

      <SpentInput onAddToDo={addToDoHandler} />

      <View style={styles.displayContainer}>
        <Text style={styles.todayColor}>
          what i spent on:
        </Text>
        <FlatList
          data={todoTexts}
          renderItem={(itemData) => (
            <SpentItem
              text={itemData.item.text}
              id={itemData.item.id}
              date={itemData.item.date} 
              onDeleteItem={deleteToDoHandler}
            />
          )}
        />
        <View style={{alignItems:'center', flexDirection:'row', marginHorizontal:100}}>
          <SecondaryButton onPress={handlePressBack} style={{padding:5}}>back</SecondaryButton>
        </View>
        
        <View style={{borderBottomWidth:1, borderBottomColor:'#ffffff', marginHorizontal:40}}></View>
        <View style={{marginHorizontal:40, marginBottom:20}}>
        <Text style={styles.totalColor}>
          Total(Month): <Text style={styles.totalValueColor}>{totalMoney}</Text>
        </Text>
        </View>
      </View>
    </View>
  );
}

export default SpentMoneyUI;


const styles = StyleSheet.create({
    splashScreen: {
      flex: 1,
      backgroundColor: 'black',
    },
    dateContainer: {
      color: 'white',
      fontSize: 35,
      fontFamily: 'CormorantGaramond-Bold',
    },
    appContainer: {
      flex: 1,
      paddingTop: 30,
      backgroundColor: "black",
      paddingHorizontal: 30,
    },
    displayContainer: {
      flex: 4
    },
    todayColor: {
      color: "white",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#cccccc',
      fontSize:20,
      fontFamily:'CormorantGaramond-Bold'
    },
    totalColor: {
      color: "white",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#cccccc',
      fontSize:20,
      fontFamily:'CormorantGaramond-Bold',
      paddingLeft:45
    },
    totalValueColor: {
      color: "white",
      fontSize:25,
      fontFamily:'CormorantGaramond-Bold',
    },
    pressedItem: {
      opacity: 0.5
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: '#e8eaed',
    },
    buttonText: {
      color: 'black',
      fontWeight: 'bold',
      paddingVertical: 8,
      paddingHorizontal: 32,
    },
    rootScreen:{
      flex: 1,
    },
    backgroundImage:{
      opacity:0.15,
    }
  });
  