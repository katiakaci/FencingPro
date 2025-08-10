/**
 * @fileoverview Composant modale réutilisable pour les interactions de jeu
 * 
 * Ce composant fournit :
 * - Une interface modale standardisée pour les actions de jeu
 * - Un système de boutons configurable avec icônes et styles
 * - L'affichage de titre et sous-titre personnalisables
 * - Une présentation cohérente pour toutes les modales du jeu
 * 
 * Utilisation :
 * - Modale de pause du jeu avec options de reprise/settings/quitter
 * - Modale de confirmation pour sauvegarder/quitter
 * - Modale de fin de partie avec options de sauvegarde
 * - Boutons configurables avec icônes, textes et styles personnalisés
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const GameModal = ({
  visible,
  title,
  titleStyle,
  subtitle,
  buttons,
  onClose
}) => {
  if (!visible) return null;

  return (
    <View style={styles.pauseMenuOverlay}>
      <View style={styles.pauseMenuContainer}>
        <Text style={[styles.pauseTitle, titleStyle]}>{title}</Text>
        {subtitle && <Text style={styles.pauseSubtitle}>{subtitle}</Text>}

        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.pauseButton, button.style]}
            onPress={button.onPress}
          >
            <Ionicons name={button.icon} size={24} color={button.textColor || '#fff'} style={styles.pauseButtonIcon} />
            <Text style={[styles.pauseButtonText, { color: button.textColor || '#fff' }]}>
              {button.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pauseMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pauseMenuContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  pauseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a3871',
    marginBottom: 15,
    textAlign: 'center',
  },
  pauseSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00c9a7',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  pauseButtonIcon: {
    marginRight: 10,
  },
  pauseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});