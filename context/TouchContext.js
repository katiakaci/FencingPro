/**
 * @fileoverview Contexte de gestion de la détection des touches d'escrime
 * 
 * Ce contexte gère :
 * - L'état de détection des touches (touchDetected)
 * - La réception des signaux de touche depuis l'équipement BLE
 * - La synchronisation entre la détection et l'affichage visuel/sonore
 * 
 * Fonctionnement :
 * - Reçoit les signaux via BluetoothContext
 * - Met à jour l'état touchDetected (true/false)
 * - Utilisé par GameScreen pour déclencher :
 *   - Les effets visuels (flash, changement de couleur)
 *   - Les effets sonores
 *   - L'incrémentation des scores
 */

import React, { createContext, useContext, useState } from 'react';

const TouchContext = createContext();

export const TouchProvider = ({ children }) => {
    const [touchDetected, setTouchDetected] = useState(false);

    return (
        <TouchContext.Provider value={{ touchDetected, setTouchDetected }}>
            {children}
        </TouchContext.Provider>
    );
};

export const useTouch = () => useContext(TouchContext);
