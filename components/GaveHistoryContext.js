import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GaveHistoryContext = createContext();

export const GaveHistoryProvider = ({ children }) => {
  const [gaveHistory, setGaveHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('gavehistory');
        if (storedHistory) {
          setGaveHistory(JSON.parse(storedHistory));
        } else {
          // Set initial state to an empty array if there is no stored history
          setGaveHistory([]);
        }
      } catch (error) {
        console.error('Error loading history from AsyncStorage:', error);
      }
    };

    loadHistory();
  }, []);

  const addToHistory = (action, item) => {
    const updatedHistory = [...gaveHistory, { action, item }];
    setGaveHistory(updatedHistory);

    // Save the updated history to AsyncStorage
    try {
      AsyncStorage.setItem('gavehistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving history to AsyncStorage:', error);
    }
  };

  return (
    <GaveHistoryContext.Provider value={{ gaveHistory, addToHistory }}>
      {children}
    </GaveHistoryContext.Provider>
  );
};

export const useGaveHistory = () => {
    const context = useContext(GaveHistoryContext);
    if (!context) {
      throw new Error('useGaveHistory must be used within a GaveHistoryProvider');
    }
    return context;
  };