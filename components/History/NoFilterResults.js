/**
 * @fileoverview Composant d'affichage quand aucun résultat ne correspond aux filtres
 * 
 * Ce composant gère :
 * - L'affichage d'un message informatif quand les filtres ne donnent aucun résultat
 * - La présentation des filtres actifs pour clarifier la recherche
 * - Un bouton pour effacer tous les filtres et revenir à la vue complète
 * - Un design centré et engageant pour encourager l'action
 * 
 * Fonctionnalités :
 * - Icône de recherche pour indiquer l'absence de résultats
 * - Affichage dynamique des filtres actifs
 * - Bouton "Tout effacer" pour reset rapide
 * - Texte responsive qui s'adapte à la largeur d'écran
 * - Gestion automatique du formatage des filtres multiples
 * 
 * @param {Function} onClearFilter - Callback pour effacer tous les filtres
 * @param {Object} activeFilters - Objet contenant les filtres actuellement actifs
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../languages/i18n';

export const NoFilterResults = ({ onClearFilter, activeFilters }) => {
    const getActiveFiltersText = () => {
        const filterTexts = [];

        Object.entries(activeFilters).forEach(([type, values]) => {
            if (values && values.length > 0) {
                const typeLabel = i18n.t(`history.${type}`);
                filterTexts.push(`${typeLabel}: ${values.join(', ')}`);
            }
        });

        return filterTexts.join(' • ');
    };

    return (
        <View style={styles.container}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.title}>{i18n.t('history.noFilterResults')}</Text>
            <View style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>
                    {i18n.t('history.noFilterResultsSubtext')}
                </Text>
            </View>
            <Text style={styles.filtersText}>
                {getActiveFiltersText()}
            </Text>
            <TouchableOpacity style={styles.clearButton} onPress={onClearFilter}>
                <Ionicons name="close-circle" size={20} color="#357ab7" />
                <Text style={styles.clearButtonText}>{i18n.t('history.clearAll')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        width: '100%',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
        width: '100%',
    },
    subtitleContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 8,
        paddingHorizontal: 20,
    },
    subtitle: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        lineHeight: 20,
        width: '95%',
        flexWrap: 'wrap',
    },
    filtersText: {
        fontSize: 12,
        color: '#357ab7',
        marginTop: 8,
        textAlign: 'center',
        fontStyle: 'italic',
        width: '90%',
        flexWrap: 'wrap',
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f5ff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#357ab7',
    },
    clearButtonText: {
        color: '#357ab7',
        fontWeight: '600',
        marginLeft: 6,
    },
});