import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [selectedSound, setSelectedSound] = useState('alert_touch.mp3');

  return (
    <SettingsContext.Provider value={{
      soundEnabled,
      setSoundEnabled,
      vibrationEnabled,
      setVibrationEnabled,
      selectedSound,
      setSelectedSound,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};