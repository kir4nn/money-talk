import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert
} from 'react-native';
import moment from 'moment';
import ToDoItem from './ToDoItem';
import ToDoInput from './ToDoInput';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGaveHistory } from './GaveHistoryContext';

function OwesMeUI({}){
  const [splashIsVisible, setSplashIsVisible] = useState(true);
  const [todoTexts, setToDoTexts] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);

  const [history, setHistory] = useState([]);
  const { addToHistory } = useGaveHistory();


  useEffect(() => {
    // Load stored todos from AsyncStorage when the component mounts
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem('todos');
        if (storedTodos) {
          const parsedTodos = JSON.parse(storedTodos);
          setToDoTexts(parsedTodos);

          const initialTotal = parsedTodos.reduce((total, todo) => {
            const money = parseInt(todo.text.split(':')[0].replace('₹', ''), 10);
            return total + money;
          }, 0);
          setTotalMoney(initialTotal);
        }
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    };

    loadTodos();
  }, []);

  const saveTodos = async (todos) => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };
  function isNullOrEmpty(str) {
    if(str === null || str.trim() === '')
      return true;
  }
  function addToDoHandler(enteredToDoText, enteredMoney, enteredRecepient) {
    if(isNaN(enteredMoney)||enteredMoney<=0||enteredMoney.startsWith(".")||enteredMoney.startsWith(",")){
      Alert.alert(
          'invalid number', 
          'money is null or has special char',
          [{text:'okay', style:'destructive'}]
      )
      return;
    }
    
    if(isNullOrEmpty(enteredToDoText)){
      Alert.alert(
          'no description', 
          'please add a description',
          [{text:'okay', style:'destructive'}]
      )
      return;
    }
    if (enteredToDoText && enteredMoney && enteredRecepient !== '') {
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

      setHistory((currentHistory) => [...currentHistory, { action: 'add', item: newToDo }]);
      addToHistory('add', newToDo);
    }
  }

  function deleteToDoHandler(id) {
    setToDoTexts((currentToDoTexts) => {
      const deletedItem = currentToDoTexts.find((todo) => todo.id === id);
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

      // Reverse the currentHistory array before updating state
      setHistory((currentHistory) => [...currentHistory, { action: 'delete', item: deletedItem }].reverse());
      addToHistory('delete', deletedItem);

      return updatedTodos;
    });
  }

  const day = moment().format('dddd').toLowerCase();

  return (
    <View style={styles.appContainer}>
      <View>
        <Text style={styles.dateContainer}>{day}.</Text>
      </View>

      <ToDoInput onAddToDo={addToDoHandler} />

      <View style={styles.displayContainer}>
        <Text style={styles.todayColor}>
          who owes me:
        </Text>
        <FlatList
          data={todoTexts}
          renderItem={(itemData) => (
            <ToDoItem
              text={itemData.item.text}
              id={itemData.item.id}
              date={itemData.item.date} 
              onDeleteItem={deleteToDoHandler}
            />
          )}
        />
        <View style={{borderBottomWidth:1, borderBottomColor:'#ffffff', marginHorizontal:40}}></View>
        <View style={{marginHorizontal:40, marginBottom:20}}>
        <Text style={styles.totalColor}>
          Total: <Text style={styles.totalValueColor}>{totalMoney}</Text>
        </Text>
        </View>
      </View>
    </View>
  );
}

export default OwesMeUI;


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
      paddingLeft:75
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
  