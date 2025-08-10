/**
 * @fileoverview Composant de sélection du mode de jeu
 * 
 * Ce composant gère :
 * - La sélection entre mode solo et multijoueur
 * - L'affichage des boutons de mode avec état sélectionné
 * - La mise à jour du mode actuel
 * 
 * Fonctionnalités :
 * - Boutons toggle pour solo/multijoueur
 * - Indication visuelle du mode sélectionné
 * - Callback de changement de mode
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from '../../languages/i18n';

export const ModeSelector = ({ mode, onModeChange }) => {
    return (
        <View style={styles.block}>
            <Text style={styles.label}>{i18n.t('setup.mode')}</Text>
            <View style={styles.row}>
                <TouchableOpacity
                    style={[styles.modeButton, mode === 'solo' && styles.selected]}
                    onPress={() => onModeChange('solo')}
                >
                    <Text style={styles.modeText}>{i18n.t('setup.solo')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modeButton, mode === 'multi' && styles.selected]}
                    onPress={() => onModeChange('multi')}
                >
                    <Text style={styles.modeText}>{i18n.t('setup.multiplayer')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    block: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 14,
        padding: 10,
        marginBottom: 12,
        width: '100%',
        maxWidth: 340,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 6,
    },
    modeButton: {
        paddingVertical: 7,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginHorizontal: 6,
        borderWidth: 2,
        borderColor: '#007acc',
    },
    selected: {
        backgroundColor: '#007acc',
        borderColor: '#005a99',
    },
    modeText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#111',
    },
});