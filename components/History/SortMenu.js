/**
 * @fileoverview Composant de menu de tri pour l'historique
 * 
 * Ce composant gère :
 * - L'affichage du bouton de tri avec l'ordre actuel
 * - La modal de sélection des critères de tri
 * - Le changement d'ordre croissant/décroissant
 * - La sélection du type de tri (date, durée, score)
 * 
 * Fonctionnalités :
 * - Menu déroulant avec options de tri
 * - Toggle ascendant/descendant
 * - Indication visuelle de l'option sélectionnée
 */
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../languages/i18n';

export const SortMenu = ({
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    sortMenuVisible,
    setSortMenuVisible
}) => {
    const sortOptions = [
        { key: 'date', label: i18n.t('history.date') },
        { key: 'duration', label: i18n.t('history.duration') },
        { key: 'score', label: i18n.t('history.score') },
    ];

    return (
        <View style={styles.sortBar}>
            <TouchableOpacity
                style={styles.sortMenuBtn}
                onPress={() => setSortMenuVisible(true)}
            >
                <Ionicons
                    name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'}
                    size={18}
                    color="#357ab7"
                />
                <Text style={styles.sortMenuText}>{i18n.t('history.sort')}</Text>
                <Ionicons name="chevron-down" size={16} color="#357ab7" />
            </TouchableOpacity>

            <Modal
                visible={sortMenuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setSortMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setSortMenuVisible(false)}
                    activeOpacity={1}
                >
                    <TouchableOpacity
                        style={styles.sortDropdown}
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {sortOptions.map(opt => (
                            <TouchableOpacity
                                key={opt.key}
                                style={styles.sortDropdownItem}
                                onPress={() => {
                                    setSortBy(opt.key);
                                    setSortMenuVisible(false);
                                }}
                            >
                                <Text style={[
                                    styles.sortDropdownText,
                                    sortBy === opt.key && { color: '#357ab7', fontWeight: 'bold' }
                                ]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <View style={styles.sortOrderRow}>
                            <TouchableOpacity
                                onPress={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
                                style={styles.sortOrderBtn}
                            >
                                <Ionicons
                                    name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'}
                                    size={16}
                                    color="#357ab7"
                                />
                                <Text style={styles.sortOrderText}>
                                    {sortOrder === 'desc' ? i18n.t('history.descending') : i18n.t('history.ascending')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    sortBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 6,
        marginTop: 2,
    },
    sortMenuBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ececec',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    sortMenuText: {
        color: '#357ab7',
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 6,
        marginRight: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sortDropdown: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        minWidth: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.13,
        shadowRadius: 4,
        elevation: 4,
    },
    sortDropdownItem: {
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    sortDropdownText: {
        fontSize: 14,
        color: '#333',
    },
    sortOrderRow: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 8,
        paddingTop: 6,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    sortOrderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortOrderText: {
        color: '#357ab7',
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 4,
    },
});