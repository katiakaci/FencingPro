import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * @fileoverview Composant d'affichage des scores et informations de match
 * 
 * Ce composant affiche :
 * - Les noms des joueurs dans des conteneurs stylisés
 * - Les scores individuels dans des cercles visuels
 * - Le type d'arme utilisé pour le match
 * - L'adaptation automatique pour les modes solo et multijoueur
 * 
 * Modes supportés :
 * - Mode solo : Affichage d'un seul joueur sans bordure de séparation
 * - Mode multijoueur : Affichage de deux joueurs côte à côte
 * - Affichage du type d'arme centralisé sous les scores
 * - Mise en page responsive selon le mode
 */

export const ScoreDisplay = ({ playerName, player2Name, joueur2Score, joueur1Score, isSolo, weaponType }) => {
  return (
    <>
      <View style={styles.nameContainer}>
        <View style={[styles.nameBox, { borderRightWidth: isSolo ? 0 : 2 }]}>
          <Text style={styles.nameText}>{playerName}</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{joueur2Score}</Text>
          </View>
        </View>
        {!isSolo && (
          <View style={styles.nameBox}>
            <Text style={styles.nameText}>{player2Name}</Text>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{joueur1Score}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.weaponContainer}>
        <Text style={styles.weaponText}>{weaponType}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: 'row',
    height: 100,
    marginBottom: 8,
  },
  nameBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    marginHorizontal: 4,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 1,
  },
  scoreCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a3871',
  },
  weaponContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  weaponText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});