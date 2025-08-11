/**
 * @fileoverview Hook personnalisé pour la gestion de la langue
 * 
 * Ce hook gère :
 * - Le chargement de la langue sauvegardée au démarrage
 * - Le basculement entre français et anglais
 * - La persistance de la langue sélectionnée dans AsyncStorage
 * - La synchronisation avec i18n pour les traductions
 * - La gestion des erreurs de changement de langue
 * 
 * Fonctionnalités :
 * - État de la langue actuelle
 * - Fonction toggle pour basculer entre fr/en
 * - Sauvegarde automatique des préférences
 * - Chargement automatique au démarrage
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