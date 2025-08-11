/**
 * @fileoverview Composant de sélection des types d'armes
 * 
 * Ce composant gère :
 * - La sélection du type d'arme pour le joueur 1
 * - La sélection du type d'arme pour le joueur 2 (mode multijoueur)
 * - L'affichage des armes disponibles (Épée, Fleuret)
 * - La validation des sélections requises
 * 
 * Fonctionnalités :
 * - Boutons de sélection d'arme avec état visuel
 * - Gestion séparée des armes pour chaque joueur
 * - Affichage conditionnel pour le mode multijoueur
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from '../../languages/i18n';

const weaponKeys = ['epee', 'foil'];

export const WeaponSelector = ({
    mode,
    selectedWeapon,
    setSelectedWeapon,
    selectedWeapon2,
    setSelectedWeapon2
}) => {
    return (
        <>
            {/* Arme joueur 1 */}
            <View style={styles.block}>
                <Text style={styles.label}>
                    {mode === 'solo' ? i18n.t('setup.weaponType') : i18n.t('setup.weaponTypePlayer1')}
                </Text>
                <View style={styles.row}>
                    {weaponKeys.map((weaponKey) => (
                        <TouchableOpacity
                            key={weaponKey}
                            style={[styles.weaponButton, selectedWeapon === weaponKey && styles.selected]}
                            onPress={() => setSelectedWeapon(weaponKey)}
                        >
                            <Text style={styles.weaponText}>{i18n.t(`weapons.${weaponKey}`)}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Arme joueur 2 (si mode multi) */}
            {mode === 'multi' && (
                <View style={styles.block}>
                    <Text style={styles.label}>{i18n.t('setup.weaponTypePlayer2')}</Text>
                    <View style={styles.row}>
                        {weaponKeys.map((weaponKey) => (
                            <TouchableOpacity
                                key={weaponKey}
                                style={[styles.weaponButton, selectedWeapon2 === weaponKey && styles.selected]}
                                onPress={() => setSelectedWeapon2(weaponKey)}
                            >
                                <Text style={styles.weaponText}>{i18n.t(`weapons.${weaponKey}`)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </>
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
    weaponButton: {
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
    weaponText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#111',
    },
});