/**
 * @fileoverview Contexte de gestion de l'historique des matchs d'escrime
 * 
 * Ce contexte gère :
 * - Le stockage persistant de l'historique des matchs (AsyncStorage)
 * - L'ajout de nouveaux matchs
 * - La suppression de matchs individuels ou de tout l'historique
 * - Le chargement automatique de l'historique au démarrage
 * - La synchronisation entre les différents écrans
 * 
 * Structure des données de match :
 * - date : Date et heure du match
 * - players : Nom(s) du/des joueur(s)
 * - weapon : Type d'arme utilisée
 * - score : Score final du match
 * - duration : Durée du match formatée
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryContext = createContext();

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
};

export const HistoryProvider = ({ children }) => {
    const [matchHistory, setMatchHistory] = useState([]);

    // Fonction pour normaliser les noms d'armes vers le format standard français
    const normalizeWeaponName = (weaponStr) => {
        if (!weaponStr) return weaponStr;

        // Normaliser une seule arme
        const normalizeOne = (w) => {
            const weapon = w.trim().toLowerCase();
            // Toutes les variantes de "Épée" -> "Épée"
            if (weapon === 'sword' || weapon === 'spada' || weapon === 'espada' ||
                weapon === 'degen' || weapon === 'épée' || weapon === 'epee') {
                return 'Épée';
            }
            // Toutes les variantes de "Fleuret" -> "Fleuret"
            if (weapon === 'foil' || weapon === 'fioretto' || weapon === 'florete' ||
                weapon === 'florett' || weapon === 'fleuret') {
                return 'Fleuret';
            }
            return w.trim();
        };

        // Gérer le cas "Arme1 vs Arme2"
        if (weaponStr.includes(' vs ')) {
            const weapons = weaponStr.split(' vs ');
            return weapons.map(w => normalizeOne(w)).join(' vs ');
        }

        return normalizeOne(weaponStr);
    };

    const loadHistory = useCallback(async () => {
        try {
            const data = await AsyncStorage.getItem('matchHistory');
            let history = data ? JSON.parse(data) : [];

            // Normaliser les armes dans l'historique existant
            let needsMigration = false;
            history = history.map(match => {
                const normalizedWeapon = normalizeWeaponName(match.weapon);
                if (normalizedWeapon !== match.weapon) {
                    needsMigration = true;
                    return { ...match, weapon: normalizedWeapon };
                }
                return match;
            });

            // Si des modifications ont été faites, sauvegarder
            if (needsMigration) {
                await AsyncStorage.setItem('matchHistory', JSON.stringify(history));
                console.log('Historique migré vers format standardisé');
            }

            setMatchHistory(history);
            console.log('Historique chargé:', history.length, 'matchs');
        } catch (e) {
            console.log('Erreur chargement historique:', e);
        }
    }, []);

    const clearHistory = useCallback(async () => {
        try {
            await AsyncStorage.removeItem('matchHistory');
            setMatchHistory([]);
        } catch (e) {
            console.log('Erreur suppression historique:', e);
        }
    }, []);

    const addMatch = useCallback(async (match) => {
        console.log('addMatch appelé avec:', match);

        try {
            const currentData = await AsyncStorage.getItem('matchHistory');
            const currentHistory = currentData ? JSON.parse(currentData) : [];
            const newHistory = [match, ...currentHistory];

            await AsyncStorage.setItem('matchHistory', JSON.stringify(newHistory));
            console.log('Sauvegardé dans AsyncStorage');

            setMatchHistory(newHistory);
            console.log('État mis à jour');
        } catch (e) {
            console.log('Erreur ajout match:', e);
        }
    }, []);

    const deleteMatch = useCallback(async (index) => {
        try {
            const newHistory = matchHistory.filter((_, i) => i !== index);
            await AsyncStorage.setItem('matchHistory', JSON.stringify(newHistory));
            setMatchHistory(newHistory);
        } catch (e) {
            console.log('Erreur suppression match:', e);
        }
    }, [matchHistory]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    return (
        <HistoryContext.Provider value={{
            matchHistory,
            loadHistory,
            clearHistory,
            addMatch,
            deleteMatch,
        }}>
            {children}
        </HistoryContext.Provider>
    );
};