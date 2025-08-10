import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../languages/i18n';

export const FilterMenu = ({
    activeFilters,
    setActiveFilters,
    filterMenuVisible,
    setFilterMenuVisible,
    availableFilters
}) => {
    const getFilterDisplayText = () => {
        const activeFilterCount = Object.values(activeFilters).reduce((count, filters) =>
            count + (filters?.length || 0), 0
        );

        if (activeFilterCount === 0) {
            return i18n.t('history.filter');
        } else if (activeFilterCount === 1) {
            return `${i18n.t('history.filter')} (1)`;
        } else {
            return `${i18n.t('history.filter')} (${activeFilterCount})`;
        }
    };

    const hasActiveFilters = () => {
        return Object.values(activeFilters).some(filters => filters && filters.length > 0);
    };

    const clearAllFilters = () => {
        setActiveFilters({});
        setFilterMenuVisible(false);
    };

    const toggleFilter = (type, value) => {
        setActiveFilters(prev => {
            const currentFilters = prev[type] || [];
            const isSelected = currentFilters.includes(value);

            if (isSelected) {
                // Retirer le filtre
                const newFilters = currentFilters.filter(f => f !== value);
                if (newFilters.length === 0) {
                    const { [type]: removed, ...rest } = prev;
                    return rest;
                } else {
                    return { ...prev, [type]: newFilters };
                }
            } else {
                // Ajouter le filtre
                return { ...prev, [type]: [...currentFilters, value] };
            }
        });
    };

    const isFilterSelected = (type, value) => {
        return activeFilters[type]?.includes(value) || false;
    };

    return (
        <View style={styles.filterContainer}>
            <TouchableOpacity
                style={[styles.filterBtn, hasActiveFilters() && styles.filterBtnActive]}
                onPress={() => setFilterMenuVisible(true)}
            >
                <Ionicons
                    name="funnel"
                    size={16}
                    color={hasActiveFilters() ? '#fff' : '#357ab7'}
                />
                <Text style={[
                    styles.filterText,
                    hasActiveFilters() && styles.filterTextActive
                ]}>
                    {getFilterDisplayText()}
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={14}
                    color={hasActiveFilters() ? '#fff' : '#357ab7'}
                />
            </TouchableOpacity>

            <Modal
                visible={filterMenuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setFilterMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setFilterMenuVisible(false)}
                    activeOpacity={1}
                >
                    <TouchableOpacity
                        style={styles.filterDropdown}
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.headerRow}>
                            <Text style={styles.modalTitle}>{i18n.t('history.filter')}</Text>
                            {hasActiveFilters() && (
                                <TouchableOpacity onPress={clearAllFilters} style={styles.clearAllBtn}>
                                    <Text style={styles.clearAllText}>{i18n.t('history.clearAll')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                            {/* Filtres par arme */}
                            {availableFilters.weapon?.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>{i18n.t('history.weapon')}</Text>
                                    {availableFilters.weapon.map(weapon => (
                                        <TouchableOpacity
                                            key={weapon}
                                            style={styles.filterOption}
                                            onPress={() => toggleFilter('weapon', weapon)}
                                        >
                                            <View style={styles.checkboxContainer}>
                                                <View style={[
                                                    styles.checkbox,
                                                    isFilterSelected('weapon', weapon) && styles.checkboxSelected
                                                ]}>
                                                    {isFilterSelected('weapon', weapon) && (
                                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.optionText,
                                                    isFilterSelected('weapon', weapon) && styles.optionTextSelected
                                                ]}>
                                                    {weapon}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                    <View style={styles.divider} />
                                </>
                            )}

                            {/* Filtres par mode */}
                            {availableFilters.mode?.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>{i18n.t('history.mode')}</Text>
                                    {availableFilters.mode.map(mode => (
                                        <TouchableOpacity
                                            key={mode}
                                            style={styles.filterOption}
                                            onPress={() => toggleFilter('mode', mode)}
                                        >
                                            <View style={styles.checkboxContainer}>
                                                <View style={[
                                                    styles.checkbox,
                                                    isFilterSelected('mode', mode) && styles.checkboxSelected
                                                ]}>
                                                    {isFilterSelected('mode', mode) && (
                                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.optionText,
                                                    isFilterSelected('mode', mode) && styles.optionTextSelected
                                                ]}>
                                                    {mode}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                    <View style={styles.divider} />
                                </>
                            )}

                            {/* Filtres par joueur */}
                            {availableFilters.player?.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>{i18n.t('history.player')}</Text>
                                    {availableFilters.player.map(player => (
                                        <TouchableOpacity
                                            key={player}
                                            style={styles.filterOption}
                                            onPress={() => toggleFilter('player', player)}
                                        >
                                            <View style={styles.checkboxContainer}>
                                                <View style={[
                                                    styles.checkbox,
                                                    isFilterSelected('player', player) && styles.checkboxSelected
                                                ]}>
                                                    {isFilterSelected('player', player) && (
                                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                                    )}
                                                </View>
                                                <Text style={[
                                                    styles.optionText,
                                                    isFilterSelected('player', player) && styles.optionTextSelected
                                                ]}>
                                                    {player}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </ScrollView>

                        {/* Bouton fermer */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setFilterMenuVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>{i18n.t('settings.close')}</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    filterContainer: {
        // Pas de marginRight car maintenant centré
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ececec',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    filterBtnActive: {
        backgroundColor: '#357ab7',
    },
    filterText: {
        color: '#357ab7',
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 6,
        marginRight: 2,
        maxWidth: 100,
    },
    filterTextActive: {
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    filterDropdown: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        width: '90%',
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 8,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    clearAllBtn: {
        backgroundColor: '#ff6b6b',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    clearAllText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    scrollContainer: {
        maxHeight: 400,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#357ab7',
        marginBottom: 8,
        marginTop: 4,
    },
    filterOption: {
        paddingVertical: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ddd',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    checkboxSelected: {
        backgroundColor: '#357ab7',
        borderColor: '#357ab7',
    },
    optionText: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    optionTextSelected: {
        color: '#357ab7',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 12,
    },
    closeButton: {
        backgroundColor: '#357ab7',
        borderRadius: 8,
        paddingVertical: 10,
        marginTop: 16,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});