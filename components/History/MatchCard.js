/**
 * @fileoverview Composant de carte de match avec swipe-to-delete
 * 
 * Ce composant gère :
 * - L'affichage des informations d'un match
 * - Le formatage de la date pour l'affichage
 * - Le swipe-to-delete avec animation
 * - L'action de suppression avec confirmation
 * 
 * Fonctionnalités :
 * - Carte de match avec toutes les infos
 * - Swipe vers la gauche pour supprimer
 * - Animation de l'icône de suppression
 * - Formatage automatique des dates
 */
import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../languages/i18n';

export const MatchCard = forwardRef(({ match, index, originalIndex, onDelete }, ref) => {
    const formatDateForDisplay = (dateStr) => {
        try {
            let date;

            if (dateStr.includes(', ')) {
                const [datePart, timePart] = dateStr.split(', ');
                const [day, month, year] = datePart.split('/');
                const [hour, minute] = timePart.split(':');
                date = new Date(year, month - 1, day, hour, minute);
            } else {
                date = new Date(dateStr);
            }

            const currentLanguage = i18n.language;

            // Mapper les codes de langue vers les locales
            const localeMap = {
                'fr': 'fr-FR',
                'en': 'en-US',
                'es': 'es-ES',
                'it': 'it-IT',
                'de': 'de-DE',
                'zh': 'zh-CN',
                'ar': 'ar-SA',
                'tr': 'tr-TR',
                'ja': 'ja-JP',
                'pt': 'pt-PT'
            };

            const locale = localeMap[currentLanguage] || 'en-US';

            return date.toLocaleString(locale, {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: currentLanguage === 'en' // Format 12h uniquement pour l'anglais
            });
        } catch (error) {
            console.log('Erreur formatage date:', error);
            return dateStr;
        }
    };

    // Fonction pour traduire les armes à l'affichage
    const translateWeapon = (weaponStr) => {
        if (!weaponStr) return weaponStr;

        // Gérer le cas "Épée vs Fleuret" ou "Épée vs Épée"
        if (weaponStr.includes(' vs ')) {
            const weapons = weaponStr.split(' vs ');
            const translatedWeapons = weapons.map(w => {
                const cleanWeapon = w.trim();
                if (cleanWeapon === 'Épée') return i18n.t('weapons.epee');
                if (cleanWeapon === 'Fleuret') return i18n.t('weapons.foil');
                return cleanWeapon;
            });
            return translatedWeapons.join(' vs ');
        }

        // Cas d'une seule arme
        if (weaponStr === 'Épée') return i18n.t('weapons.epee');
        if (weaponStr === 'Fleuret') return i18n.t('weapons.foil');
        return weaponStr;
    };

    const renderRightActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0.7],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity
                style={styles.deleteBox}
                onPress={() => onDelete(index, originalIndex)}
            >
                <Animated.View style={{ transform: [{ scale }] }}>
                    <Ionicons name="trash" size={28} color="#fff" />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable
            ref={ref}
            renderRightActions={renderRightActions}
        >
            <View style={styles.matchCard}>
                <View style={styles.matchRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.matchPlayers}>{match.players}</Text>
                        <Text style={styles.matchWeapon}>{translateWeapon(match.weapon)}</Text>
                        <Text style={styles.matchDuration}>{match.duration}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', minWidth: 90 }}>
                        <Text style={styles.matchScore}>{match.score}</Text>
                        <Text style={styles.matchDate}>
                            {formatDateForDisplay(match.date)}
                        </Text>
                    </View>
                </View>
            </View>
        </Swipeable>
    );
});

const styles = StyleSheet.create({
    matchCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 2,
        elevation: 2,
    },
    matchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        flex: 1,
    },
    matchPlayers: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#222',
    },
    matchWeapon: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    matchDuration: {
        fontSize: 12,
        color: '#aaa',
        marginTop: 2,
    },
    matchScore: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#357ab7',
    },
    matchDate: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
        textAlign: 'right',
        minWidth: 90,
    },
    deleteBox: {
        backgroundColor: '#e74c3c',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: '90%',
        borderRadius: 12,
    },
});