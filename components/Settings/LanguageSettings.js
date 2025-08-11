/**
 * @fileoverview Composant de configuration de la langue
 * 
 * Ce composant gère :
 * - L'affichage de la langue actuelle avec son drapeau
 * - La sélection parmi toutes les langues disponibles
 * - La persistance de la langue sélectionnée
 * 
 * Fonctionnalités :
 * - Bouton principal avec langue actuelle
 * - Modale de sélection avec drapeaux et noms
 * - Support de 5 langues : FR, EN, ES, IT, DE
 */
import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../languages/i18n';

export const LanguageSettings = ({ 
    currentLanguage, 
    onLanguageToggle, 
    availableLanguages, 
    getCurrentLanguageInfo,
    onLanguageChange 
}) => {
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const currentLangInfo = getCurrentLanguageInfo();

    const handleLanguageSelect = (languageCode) => {
        onLanguageChange(languageCode);
        setShowLanguageModal(false);
    };

    return (
        <View style={styles.settingBlock}>
            <View style={styles.row}>
                <Text style={styles.label}>{i18n.t('settings.language')}</Text>
                
                {/* Bouton principal de langue */}
                <Pressable 
                    style={styles.actionButton} 
                    onPress={() => setShowLanguageModal(true)}
                >
                    <Text style={styles.flagText}>{currentLangInfo.flag}</Text>
                    <Text style={styles.actionButtonText}>{currentLangInfo.name}</Text>
                    <Ionicons name="chevron-down" size={16} color="#fff" />
                </Pressable>
            </View>

            {/* Modale de sélection des langues */}
            <Modal
                visible={showLanguageModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLanguageModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setShowLanguageModal(false)}
                    activeOpacity={1}
                >
                    <TouchableOpacity 
                        style={styles.modalContainer}
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{i18n.t('settings.language')}</Text>
                            <TouchableOpacity 
                                onPress={() => setShowLanguageModal(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={styles.languageList}>
                            {availableLanguages.map((language) => (
                                <TouchableOpacity
                                    key={language.code}
                                    style={[
                                        styles.languageOption,
                                        currentLanguage === language.code && styles.selectedLanguage
                                    ]}
                                    onPress={() => handleLanguageSelect(language.code)}
                                >
                                    <Text style={styles.languageFlag}>{language.flag}</Text>
                                    <Text style={[
                                        styles.languageName,
                                        currentLanguage === language.code && styles.selectedLanguageName
                                    ]}>
                                        {language.name}
                                    </Text>
                                    {currentLanguage === language.code && (
                                        <Ionicons name="checkmark" size={20} color="#007bff" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
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
        paddingHorizontal: 16,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    flagText: {
        fontSize: 18,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        maxHeight: '70%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    languageList: {
        maxHeight: 300,
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    selectedLanguage: {
        backgroundColor: '#f0f8ff',
        borderWidth: 2,
        borderColor: '#007bff',
    },
    languageFlag: {
        fontSize: 24,
        marginRight: 16,
    },
    languageName: {
        fontSize: 18,
        color: '#333',
        flex: 1,
        fontWeight: '500',
    },
    selectedLanguageName: {
        color: '#007bff',
        fontWeight: 'bold',
    },
});