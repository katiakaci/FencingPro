/**
 * @fileoverview Contexte de gestion des couleurs des signaux lumineux
 * 
 * Ce contexte gère :
 * - La couleur actuelle des LED/signaux lumineux lors des touches
 * - La synchronisation des couleurs entre GameScreen et SettingsScreen
 * - La persistance de la couleur sélectionnée par l'utilisateur
 * - La communication avec le BluetoothContext pour l'envoi vers l'équipement
 * 
 * Couleurs supportées :
 * - Couleurs de base : lime, red, blue, yellow, purple
 * - Couleurs personnalisées via ColorPicker (format hex)
 * - Conversion automatique entre formats (rgba, noms, hex)
 */
import React, { createContext, useContext, useState } from 'react';

const LightColorContext = createContext();

export const LightColorProvider = ({ children }) => {
    const [lightColor, setLightColor] = useState('lime'); // couleur par défaut

    return (
        <LightColorContext.Provider value={{ lightColor, setLightColor }}>
            {children}
        </LightColorContext.Provider>
    );
};

export const useLightColor = () => useContext(LightColorContext);
