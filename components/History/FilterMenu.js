import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../languages/i18n';

export const FilterMenu = ({
    filterBy,
    setFilterBy,
    filterValue,
    setFilterValue,
    filterMenuVisible,
    setFilterMenuVisible,
    availableFilters
}) => {
    const getFilterDisplayText = () => {
        if (filterBy === 'all') return i18n.t('history.filter');
        if (filterBy === 'weapon') return `${i18n.t('history.weapon')}: ${filterValue}`;
        if (filterBy === 'player') return `${i18n.t('history.player')}: ${filterValue}`;
        if (filterBy === 'mode') return `${i18n.t('history.mode')}: ${filterValue}`;
        return i18n.t('history.filter');
    };

    const clearFilter = () => {
        setFilterBy('all');
        setFilterValue('');
        setFilterMenuVisible(false);
    };

    const selectFilter = (type, value) => {
        setFilterBy(type);
        setFilterValue(value);
        setFilterMenuVisible(false);
    };

    return (
        <View style={styles.filterContainer}>
            <TouchableOpacity
                style={[styles.filterBtn, filterBy !== 'all' && styles.filterBtnActive]}
                onPress={() => setFilterMenuVisible(true)}
            >
                <Ionicons 
                    name="funnel" 
                    size={16} 
                    color={filterBy !== 'all' ? '#fff' : '#357ab7'} 
                />
                <Text style={[
                    styles.filterText,
                    filterBy !== 'all' && styles.filterTextActive
                ]}>
                    {getFilterDisplayText()}
                </Text>
                <Ionicons 
                    name="chevron-down" 
                    size={14} 
                    color={filterBy !== 'all' ? '#fff' : '#357ab7'} 
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
                        <Text style={styles.modalTitle}>{i18n.t('history.filter')}</Text>
                        
                        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                            {/* Option "Tout" */}
                            <TouchableOpacity
                                style={styles.filterOption}
                                onPress={clearFilter}
                            >
                                <View style={styles.checkboxContainer}>
                                    <View style={[
                                        styles.checkbox,
                                        filterBy === 'all' && styles.checkboxSelected
                                    ]}>
                                        {filterBy === 'all' && (
                                            <Ionicons name="checkmark" size={16} color="#fff" />
                                        )}
                                    </View>
                                    <Text style={[
                                        styles.optionText,
                                        filterBy === 'all' && styles.optionTextSelected
                                    ]}>
                                        {i18n.t('history.all')}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.divider} />

                            {/* Filtres par arme */}
                            <Text style={styles.sectionTitle}>{i18n.t('history.weapon')}</Text>
                            {availableFilters.weapon?.map(weapon => (
                                <TouchableOpacity
                                    key={weapon}
                                    style={styles.filterOption}
                                    onPress={() => selectFilter('weapon', weapon)}
                                >
                                    <View style={styles.checkboxContainer}>
                                        <View style={[
                                            styles.checkbox,
                                            (filterBy === 'weapon' && filterValue === weapon) && styles.checkboxSelected
                                        ]}>
                                            {(filterBy === 'weapon' && filterValue === weapon) && (
                                                <Ionicons name="checkmark" size={16} color="#fff" />
                                            )}
                                        </View>
                                        <Text style={[
                                            styles.optionText,
                                            (filterBy === 'weapon' && filterValue === weapon) && styles.optionTextSelected
                                        ]}>
                                            {weapon}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}

                            <View style={styles.divider} />

                            {/* Filtres par mode */}
                            <Text style={styles.sectionTitle}>{i18n.t('history.mode')}</Text>
                            {availableFilters.mode?.map(mode => (
                                <TouchableOpacity
                                    key={mode}
                                    style={styles.filterOption}
                                    onPress={() => selectFilter('mode', mode)}
                                >
                                    <View style={styles.checkboxContainer}>
                                        <View style={[
                                            styles.checkbox,
                                            (filterBy === 'mode' && filterValue === mode) && styles.checkboxSelected
                                        ]}>
                                            {(filterBy === 'mode' && filterValue === mode) && (
                                                <Ionicons name="checkmark" size={16} color="#fff" />
                                            )}
                                        </View>
                                        <Text style={[
                                            styles.optionText,
                                            (filterBy === 'mode' && filterValue === mode) && styles.optionTextSelected
                                        ]}>
                                            {mode}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}

                            <View style={styles.divider} />

                            {/* Filtres par joueur */}
                            <Text style={styles.sectionTitle}>{i18n.t('history.player')}</Text>
                            {availableFilters.player?.map(player => (
                                <TouchableOpacity
                                    key={player}
                                    style={styles.filterOption}
                                    onPress={() => selectFilter('player', player)}
                                >
                                    <View style={styles.checkboxContainer}>
                                        <View style={[
                                            styles.checkbox,
                                            (filterBy === 'player' && filterValue === player) && styles.checkboxSelected
                                        ]}>
                                            {(filterBy === 'player' && filterValue === player) && (
                                                <Ionicons name="checkmark" size={16} color="#fff" />
                                            )}
                                        </View>
                                        <Text style={[
                                            styles.optionText,
                                            (filterBy === 'player' && filterValue === player) && styles.optionTextSelected
                                        ]}>
                                            {player}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
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
        marginRight: 8,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ececec',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    filterBtnActive: {
        backgroundColor: '#357ab7',
    },
    filterText: {
        color: '#357ab7',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 4,
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
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 16,
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