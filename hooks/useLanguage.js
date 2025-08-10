/**
 * @fileoverview Hook personnalisé pour la gestion de la langue
 * 
 * Ce hook gère :
 * - Le chargement de la langue sauvegardée
 * - Le basculement entre les langues
 * - La persistance de la langue sélectionnée
 * - La gestion des erreurs de changement de langue
 */
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../languages/i18n';

export const useLanguage = () => {
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    useEffect(() => {
        const loadSavedLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem('userLanguage');
                if (savedLanguage) {
                    i18n.changeLanguage(savedLanguage);
                    setCurrentLanguage(savedLanguage);
                }
            } catch (error) {
                console.log('Erreur chargement langue:', error);
            }
        };

        loadSavedLanguage();
    }, []);

    const toggleLanguage = useCallback(async () => {
        const newLang = currentLanguage === 'fr' ? 'en' : 'fr';

        try {
            await i18n.changeLanguage(newLang);
            setCurrentLanguage(newLang);
            await AsyncStorage.setItem('userLanguage', newLang);
        } catch (error) {
            console.log('Erreur changement langue:', error);
        }
    }, [currentLanguage]);

    return {
        currentLanguage,
        toggleLanguage
    };
};