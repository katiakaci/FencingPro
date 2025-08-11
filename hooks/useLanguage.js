/**
 * @fileoverview Hook personnalisé pour la gestion de la langue
 * 
 * Ce hook gère :
 * - Le chargement de la langue sauvegardée au démarrage
 * - Le basculement entre toutes les langues supportées
 * - La persistance de la langue sélectionnée dans AsyncStorage
 * - La synchronisation avec i18n pour les traductions
 * - La gestion des erreurs de changement de langue
 * 
 * Fonctionnalités :
 * - État de la langue actuelle
 * - Fonction pour changer vers n'importe quelle langue
 * - Liste des langues disponibles
 * - Sauvegarde automatique des préférences
 * - Chargement automatique au démarrage
 */
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../languages/i18n';

// Langues disponibles avec leurs informations d'affichage
export const AVAILABLE_LANGUAGES = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

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

    const changeLanguage = useCallback(async (languageCode) => {
        try {
            await i18n.changeLanguage(languageCode);
            setCurrentLanguage(languageCode);
            await AsyncStorage.setItem('userLanguage', languageCode);
        } catch (error) {
            console.log('Erreur changement langue:', error);
        }
    }, []);

    const toggleLanguage = useCallback(async () => {
        // Cycle through languages: fr -> en -> es -> it -> de -> fr
        const currentIndex = AVAILABLE_LANGUAGES.findIndex(lang => lang.code === currentLanguage);
        const nextIndex = (currentIndex + 1) % AVAILABLE_LANGUAGES.length;
        const nextLanguage = AVAILABLE_LANGUAGES[nextIndex].code;
        
        await changeLanguage(nextLanguage);
    }, [currentLanguage, changeLanguage]);

    const getCurrentLanguageInfo = useCallback(() => {
        return AVAILABLE_LANGUAGES.find(lang => lang.code === currentLanguage) || AVAILABLE_LANGUAGES[0];
    }, [currentLanguage]);

    return {
        currentLanguage,
        toggleLanguage,
        changeLanguage,
        availableLanguages: AVAILABLE_LANGUAGES,
        getCurrentLanguageInfo
    };
};