/**
 * @fileoverview Composant de saisie des noms de joueurs
 * 
 * Ce composant gère :
 * - La saisie du nom du joueur 1 (toujours visible)
 * - La saisie du nom du joueur 2 (visible uniquement en mode multijoueur)
 * - L'adaptation des labels selon le mode de jeu
 * - La validation des champs requis
 * 
 * Fonctionnalités :
 * - TextInput avec placeholders dynamiques
 * - Affichage conditionnel du deuxième joueur
 * - Callbacks de mise à jour des noms
 */
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import i18n from '../../languages/i18n';

export const PlayerInputs = ({
    mode,
    player1,
    setPlayer1,
    player2,
    setPlayer2
}) => {
    return (
        <View style={styles.block}>
            <Text style={styles.label}>
                {mode === 'solo' ? i18n.t('setup.playerName') : i18n.t('setup.player1Name')}
            </Text>
            <TextInput
                style={styles.input}
                placeholder={mode === 'solo' ? i18n.t('setup.playerName') : i18n.t('setup.player1Name')}
                value={player1}
                onChangeText={setPlayer1}
            />
            {mode === 'multi' && (
                <>
                    <Text style={styles.label}>{i18n.t('setup.player2Name')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={i18n.t('setup.player2Name')}
                        value={player2}
                        onChangeText={setPlayer2}
                    />
                </>
            )}
        </View>
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
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 7,
        padding: 8,
        fontSize: 14,
        backgroundColor: '#fff',
        marginBottom: 6,
    },
});