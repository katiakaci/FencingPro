/**
 * @fileoverview Hook personnalisé pour la réinitialisation des paramètres
 * 
 * Ce hook gère :
 * - La réinitialisation complète des données de l'app
 * - La suppression de l'historique des matchs
 * - La restauration des paramètres par défaut
 * - La gestion des erreurs de réinitialisation
 */
import { useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHistory } from '../context/HistoryContext';
import { useLightColor } from '../context/LightColorContext';
import { useSettings } from '../context/SettingsContext';
import i18n from '../languages/i18n';

export const useSettingsReset = () => {
    const { clearHistory } = useHistory();
    const { setLightColor } = useLightColor();
    const { setSoundEnabled, setVibrationEnabled, setSelectedSound } = useSettings();

    const resetAllData = useCallback(async () => {
        try {
            await AsyncStorage.multiRemove([
                'matchHistory',
                'userStats',
                'gameSettings',
                'playerProfiles',
                'userLanguage'
            ]);

            await clearHistory();

            // Restaurer les paramètres par défaut
            setLightColor('lime');
            setSoundEnabled(true);
            setVibrationEnabled(true);
            setSelectedSound('alert_touch.mp3');

            // Restaurer la langue par défaut
            await i18n.changeLanguage('fr');

            Alert.alert('', i18n.t('settings.resetSuccess'));
        } catch (error) {
            console.log('Erreur lors de la réinitialisation:', error);
            Alert.alert('', i18n.t('settings.resetError'));
        }
    }, [clearHistory, setLightColor, setSoundEnabled, setVibrationEnabled, setSelectedSound]);

    return {
        resetAllData
    };
};