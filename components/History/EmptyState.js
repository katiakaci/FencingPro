/**
 * @fileoverview Composant d'état vide pour l'historique
 * 
 * Ce composant gère :
 * - L'affichage quand aucun match n'existe
 * - L'icône et le message d'encouragement
 * - Le texte explicatif pour guider l'utilisateur
 * 
 * Fonctionnalités :
 * - Icône calendrier stylisée
 * - Message principal et sous-texte
 * - Design centré et engageant
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../languages/i18n';

export const EmptyState = () => {
    return (
        <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>{i18n.t('history.noMatches')}</Text>
            <Text style={styles.emptySubtext}>{i18n.t('history.noMatchesSubtext')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
});