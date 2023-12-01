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

import ToDoItem from './components/ToDoItem';
import ToDoInput from './components/ToDoInput';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {

  const [fontsLoaded] = useFonts({
    'CormorantGaramond-Bold': require('./assets/fonts/CormorantGaramond-Bold.ttf'),
    'CormorantGaramond-Light': require('./assets/fonts/CormorantGaramond-Light.ttf')
  });

  const [splashIsVisible, setSplashIsVisible] = useState(true);
  const [todoTexts, setToDoTexts] = useState([]);

  
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

  useEffect(() => {
    // Load stored todos from AsyncStorage when the component mounts
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem('todos');
        if (storedTodos) {
          setToDoTexts(JSON.parse(storedTodos));
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
  function addToDoHandler(enteredToDoText, enteredMoney, enteredRecepient) {
    if (enteredToDoText && enteredMoney && enteredRecepient !== '') {
      const newToDo = {
        text: `₹${enteredMoney}: ${enteredRecepient}, ${enteredToDoText}`,
        id: Math.random().toString(),
      };

      setToDoTexts((currentToDoTexts) => [...currentToDoTexts, newToDo]);
      saveTodos([...todoTexts, newToDo]);
    }
  }

  function deleteToDoHandler(id) {
    setToDoTexts(currentToDoTexts =>
       currentToDoTexts.filter(todo => todo.id !== id)
      );
      saveTodos(todoTexts.filter((todo) => todo.id !== id));
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
              onDeleteItem={deleteToDoHandler}
            />
          )}
        />
      </View>
    </View>
  );
}

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
