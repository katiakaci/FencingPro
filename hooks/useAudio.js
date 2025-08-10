/**
 * @fileoverview Hook personnalisé pour la gestion audio
 * 
 * Ce hook gère :
 * - La lecture des sons de prévisualisation
 * - La logique de sélection de sons
 * - Le nettoyage automatique des objets Audio
 * - La gestion des erreurs de lecture
 */
import { useCallback } from 'react';
import { Audio } from 'expo-av';
import { SOUNDS, SOUND_FILES } from '../constants/sounds';
import i18n from '../languages/i18n';

export const useAudio = () => {
    const playPreviewSound = useCallback(async (soundFile) => {
        try {
            const soundAsset = SOUND_FILES[soundFile];
            if (!soundAsset) return;

            const { sound } = await Audio.Sound.createAsync(soundAsset);
            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate(status => {
                if (status.didJustFinish) sound.unloadAsync();
            });
        } catch (e) {
            console.log('Erreur lecture son:', e);
        }
    }, []);

    const getSelectedSoundName = useCallback((selectedSound) => {
        const sound = SOUNDS.find(s => s.file === selectedSound);
        return sound ? i18n.t(`settings.${sound.name}`) : i18n.t('settings.sounds.classic');
    }, []);

    return {
        playPreviewSound,
        getSelectedSoundName,
        SOUNDS,
        SOUND_FILES
    };
};