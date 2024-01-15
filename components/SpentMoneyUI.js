import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import moment from 'moment';
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpentInput from './SpentInput';
import SpentItem from './SpentItem';

function SpentMoneyUI({}) {
  const [todoTexts, setToDoTexts] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);
  const [totalLifetimeMoney, setTotalLifetimeMoney] = useState(0);
  const [lastResetDate, setLastResetDate] = useState('');

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem('spentmoni');
        if (storedTodos) {
          const parsedTodos = JSON.parse(storedTodos);

          // Create an object to store the total amount for each month
          const monthlyTotalMap = {};

          // Iterate through all stored todos
          parsedTodos.forEach((todo) => {
            const todoDateMoment = moment(todo.date, 'MMM D');
            const monthKey = todoDateMoment.format('YYYY-MM'); // Use year and month as a key

            // Update the total for the corresponding month
            if (!monthlyTotalMap[monthKey]) {
              monthlyTotalMap[monthKey] = 0;
            }

            const money = parseInt(todo.text.split(':')[0].replace('₹', ''), 10);
            monthlyTotalMap[monthKey] += money;
          });

          // Now, you have a map with total amounts for each month
          console.log('Monthly Total Map:', monthlyTotalMap);

          // Calculate the initial lifetime total
          const initialLifetimeTotal = parsedTodos.reduce((total, todo) => {
            const money = parseInt(todo.text.split(':')[0].replace('₹', ''), 10);
            return total + money;
          }, 0);
          setTotalLifetimeMoney(initialLifetimeTotal);

          // Find the most recent item and set its date as the last reset date
          if (parsedTodos.length > 0) {
            const mostRecentDate = parsedTodos[0].date; // Assuming the date is in the format "MMM D"
            setLastResetDate(mostRecentDate);

            // Check if the most recent item is in the current month
            const isCurrentMonth = moment(mostRecentDate, 'MMM D').isSame(moment(), 'month');
            if (isCurrentMonth) {
              // Set totalMoney to the cost of the recent month or 0 if there are no items added this month
              const currentMonthKey = moment().format('YYYY-MM');
              setTotalMoney(monthlyTotalMap[currentMonthKey] || 0);
            } else {
              // If the most recent item is not in the current month, set totalMoney to 0
              setTotalMoney(0);
            }
          } else {
            // If there are no stored todos, set lastResetDate to the current date
            setLastResetDate(moment().format('MMM D'));
            setTotalMoney(0);
          }

          // Set todoTexts after the logic for totalMoney is determined
          setToDoTexts(parsedTodos);
        } else {
          // If there are no stored todos, set lastResetDate to the current date
          setLastResetDate(moment().format('MMM D'));
          setTotalMoney(0);
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
    if (
      isNaN(enteredMoney) ||
      enteredMoney <= 0 ||
      enteredMoney.startsWith('.') ||
      enteredMoney.startsWith(',')
    ) {
      Alert.alert('Invalid number', 'Money is null or has a special character', [
        { text: 'Okay', style: 'destructive' },
      ]);
      return;
    }

    if (!enteredRecepient) {
      Alert.alert('Invalid recepient', 'Choose a recepient', [
        { text: 'Okay', style: 'destructive' },
      ]);
      return;
    }

    if (enteredMoney && enteredRecepient !== '') {
      const money = parseInt(enteredMoney, 10);
      const currentDate = moment().format('MMM D');

      const newToDo = {
        text: `₹${enteredMoney}: ${enteredRecepient}, ${enteredToDoText}`,
        id: Math.random().toString(),
        date: currentDate,
      };

      setToDoTexts((currentToDoTexts) => [newToDo, ...currentToDoTexts]);
      saveTodos([newToDo, ...todoTexts]);

      // Update the lifetime total
      setTotalLifetimeMoney((currentLifetimeTotal) => currentLifetimeTotal + money);

      // Update the total money for all items
      setTotalMoney((currentTotal) => currentTotal + money);
    }
  }

  useEffect(() => {
    const resetMonth = () => {
      setLastResetDate(moment().format('YYYY-MM-DD'));
    };

    const interval = setInterval(resetMonth, 86400000); // Check every day

    return () => clearInterval(interval);
  }, []);

  function deleteToDoHandler(id) {
    setToDoTexts((currentToDoTexts) => {
      const updatedTodos = currentToDoTexts.filter((todo) => todo.id !== id);
      saveTodos(updatedTodos);
  
      // Update the lifetime total
      const newLifetimeTotal = updatedTodos.reduce((total, todo) => {
        const todoMoney = parseInt(todo.text.split(':')[0].replace('₹', ''), 10);
        return total + todoMoney;
      }, 0);
      setTotalLifetimeMoney(newLifetimeTotal);
  
      const currentMonthTodos = updatedTodos.filter((todo) => {
        const todoDateMoment = moment(todo.date, 'MMM D');
        return todoDateMoment.isSame(moment(), 'month');
      });
  
      const currentMonthTotal = currentMonthTodos.reduce((total, todo) => {
        const todoMoney = parseInt(todo.text.split(':')[0].replace('₹', ''), 10);
        return total + todoMoney;
      }, 0);
  
      setTotalMoney((prevTotal) => {
        if (currentMonthTotal > 0) {
          // If there are items in the current month, use the current month total
          return currentMonthTotal;
        } else {
          // If there are no items in the current month, set the monthly total to 0
          return 0;
        }
      });
  
      return updatedTodos;
    });
  }

  const day = moment().format('dddd').toLowerCase();
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

        <View style={{marginHorizontal:40, marginBottom:20, alignItems:'center',
          borderTopWidth:1, borderBottomColor:'#ccccc'}}>
          <Text style={styles.totalColor}>
            Month:<Text style={styles.totalValueColor}>{totalMoney}</Text>

            <Text style={styles.totalLifetimeColor}>
                {'\n'}Lifetime:<Text style={styles.totalValueColor}>{totalLifetimeMoney}</Text>
            </Text>
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
      borderTopWidth:1,
      borderTopColor:'#cccccc',
      fontSize:20,
      fontFamily:'CormorantGaramond-Bold',
    },
    totalLifetimeColor:{
      color: "white",
      padding: 10,
      fontSize:20,
      fontFamily:'CormorantGaramond-Bold',
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
  