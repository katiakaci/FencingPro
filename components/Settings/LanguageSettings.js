/**
 * @fileoverview Composant de configuration de la langue
 * 
 * Ce composant gère :
 * - L'affichage de la langue actuelle
 * - Le basculement entre français et anglais
 * - La persistance de la langue sélectionnée
 * - La mise à jour de l'interface utilisateur
 * 
 * Fonctionnalités :
 * - Bouton de changement de langue avec texte dynamique
 * - Sauvegarde automatique de la préférence
 * - Gestion des erreurs de changement de langue
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import i18n from '../../languages/i18n';

export const LanguageSettings = ({ currentLanguage, onLanguageToggle }) => {
    return (
        <View style={styles.settingBlock}>
            <View style={styles.row}>
                <Text style={styles.label}>{i18n.t('settings.language')}</Text>
                <Pressable style={styles.actionButton} onPress={onLanguageToggle}>
                    <Text style={styles.actionButtonText}>
                        {currentLanguage === 'fr' ? 'English' : 'Français'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    settingBlock: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 16,
        borderRadius: 24,
        marginBottom: 24,
        marginHorizontal: 24,
    },
    label: {
        fontSize: 20,
        fontWeight: '600',
        color: '#002244',
        marginBottom: 8,
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    actionButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 18,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});