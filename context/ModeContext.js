import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState('solo'); // par défaut solo

  useEffect(() => {
    const loadMode = async () => {
      const storedMode = await AsyncStorage.getItem('mode');
      if (storedMode) setMode(storedMode);
    };
    loadMode();
  }, []);

  const updateMode = async (newMode) => {
    setMode(newMode);
    await AsyncStorage.setItem('mode', newMode);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode: updateMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);