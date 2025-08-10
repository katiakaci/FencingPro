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
            <Text style={styles.subtitle}>
                {i18n.t('history.noFilterResultsSubtext')}
            </Text>
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
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 20,
    },
    filtersText: {
        fontSize: 12,
        color: '#357ab7',
        marginTop: 8,
        textAlign: 'center',
        fontStyle: 'italic',
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