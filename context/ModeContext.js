/**
 * @fileoverview Contexte de gestion du mode de jeu (Solo/Multijoueur)
 * 
 * Ce contexte gère :
 * - Le mode de jeu actuel (solo ou multijoueur)
 * - La persistance du mode sélectionné entre les sessions
 * - La synchronisation du mode entre SetupScreen et GameScreen
 * 
 * Modes disponibles :
 * - 'solo' : Un seul joueur, score individuel
 * - 'multi' : Deux joueurs, scores séparés et comparaison
 * 
 * Utilisé principalement dans :
 * - SetupScreen : Sélection du mode
 * - GameScreen : Adaptation de l'interface et des règles
 */

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