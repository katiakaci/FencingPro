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

    const loadHistory = useCallback(async () => {
        try {
            const data = await AsyncStorage.getItem('matchHistory');
            const history = data ? JSON.parse(data) : [];
            setMatchHistory(history);
            console.log('📊 Historique chargé:', history.length, 'matchs');
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
        console.log('🔄 addMatch appelé avec:', match);

        try {
            const currentData = await AsyncStorage.getItem('matchHistory');
            const currentHistory = currentData ? JSON.parse(currentData) : [];
            const newHistory = [match, ...currentHistory];

            await AsyncStorage.setItem('matchHistory', JSON.stringify(newHistory));
            console.log('💾 Sauvegardé dans AsyncStorage');

            setMatchHistory(newHistory);
            console.log('✅ État mis à jour');
        } catch (e) {
            console.log('❌ Erreur ajout match:', e);
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