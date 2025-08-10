/**
 * @fileoverview Contexte de gestion des paramètres globaux de l'application
 * 
 * Ce contexte gère :
 * - Les paramètres audio (activation, sélection du son de touche)
 * - Les paramètres de vibration pour l'équipement connecté
 * - Le stockage persistant des préférences utilisateur (AsyncStorage)
 * - La synchronisation des paramètres entre écrans et équipement BLE
 * 
 * Paramètres gérés :
 * - soundEnabled : Activation/désactivation des sons de touche
 * - selectedSound : Fichier audio sélectionné pour les alertes
 * - vibrationEnabled : Activation/désactivation de la vibration
 * 
 * Intégration :
 * - Chargement automatique au démarrage de l'app
 * - Sauvegarde automatique lors des modifications
 * - Communication avec BluetoothContext pour l'envoi vers l'équipement
 */

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