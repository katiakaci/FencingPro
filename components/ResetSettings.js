/**
 * @fileoverview Composant de réinitialisation des données
 * 
 * Ce composant gère :
 * - L'affichage de l'option de réinitialisation
 * - La modal de confirmation de réinitialisation
 * - L'exécution de la réinitialisation complète
 * - L'affichage des messages de confirmation
 * 
 * Fonctionnalités :
 * - Bouton de réinitialisation avec avertissement
 * - Modal de confirmation avec icône d'avertissement
 * - Boutons d'annulation et de confirmation
 * - Gestion des erreurs de réinitialisation
 */
import React from 'react';
import { View, Text, Pressable, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../languages/i18n';

export const ResetSettings = ({
    showResetDialog,
    setShowResetDialog,
    onResetData
}) => {
    return (
        <>
            <View style={styles.settingBlock}>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.t('settings.reset')}</Text>
                    <Pressable style={styles.resetButton} onPress={() => setShowResetDialog(true)}>
                        <Text style={styles.resetButtonText}>{i18n.t('settings.resetAll')}</Text>
                    </Pressable>
                </View>
                <Text style={styles.resetWarning}>
                    {i18n.t('settings.resetWarning')}
                </Text>
            </View>

            {/* Modal confirmation réinitialisation */}
            <Modal
                visible={showResetDialog}
                transparent
                animationType="fade"
                onRequestClose={() => setShowResetDialog(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.resetModal}>
                        <Ionicons name="warning" size={48} color="#e74c3c" style={styles.warningIcon} />
                        <Text style={styles.resetModalTitle}>{i18n.t('settings.resetConfirmTitle')}</Text>
                        <Text style={styles.resetModalText}>
                            {i18n.t('settings.resetConfirmText')}
                        </Text>

                        <View style={styles.resetButtonRow}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowResetDialog(false)}
                            >
                                <Text style={styles.cancelButtonText}>{i18n.t('game.cancel')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.confirmResetButton}
                                onPress={onResetData}
                            >
                                <Text style={styles.confirmResetButtonText}>{i18n.t('settings.resetAll')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
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
    resetButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 18,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    resetWarning: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 8,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resetModal: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
    },
    warningIcon: {
        marginBottom: 16,
    },
    resetModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        color: '#002244',
    },
    resetModalText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'left',
        marginBottom: 24,
        lineHeight: 20,
    },
    resetButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        padding: 12,
        borderRadius: 12,
        flex: 0.45,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmResetButton: {
        backgroundColor: '#e74c3c',
        padding: 12,
        borderRadius: 12,
        flex: 0.45,
        alignItems: 'center',
    },
    confirmResetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});