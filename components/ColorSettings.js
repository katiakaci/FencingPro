/**
 * @fileoverview Composant de configuration des couleurs de signalisation
 * 
 * Ce composant gère :
 * - L'affichage des couleurs prédéfinies (lime, red, blue, yellow, purple)
 * - La sélection de couleurs personnalisées via ColorPicker
 * - L'affichage de la couleur actuellement sélectionnée
 * - La modal de sélection de couleurs avancées
 * 
 * Interface :
 * - Boutons de couleurs prédéfinies avec indication visuelle de sélection
 * - Bouton gradient pour accéder aux couleurs personnalisées
 * - Modal intégrée avec ColorPicker pour les couleurs avancées
 * - Gestion de l'état d'affichage de la modal
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';
import { ColorPicker } from './ColorPicker';
import i18n from '../languages/i18n';

const COLORS = ['lime', 'red', 'blue', 'yellow', 'purple'];

export const ColorSettings = ({
  lightColor,
  onColorChange,
  showColorGradient,
  setShowColorGradient
}) => {
  const isCustomColor = !COLORS.includes(lightColor);

  return (
    <>
      <View style={styles.settingBlock}>
        <Text style={styles.label}>{i18n.t('settings.lightColors')}</Text>

        <View style={styles.colorRow}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => onColorChange(color)}
              style={[
                styles.colorDot,
                { backgroundColor: color },
                lightColor === color && styles.colorSelected,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.gradientButtonContainer,
            {
              borderColor: isCustomColor ? '#002244' : '#fff',
            }
          ]}
          onPress={() => setShowColorGradient(true)}
        >
          <LinearGradient
            colors={['#FF0000', '#FF8000', '#FFFF00', '#00FF00', '#0080FF', '#8000FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.gradientButtonText}>
              {i18n.t('settings.otherColors')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Modal des couleurs personnalisées */}
      <Modal
        visible={showColorGradient}
        transparent
        animationType="slide"
        onRequestClose={() => setShowColorGradient(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.colorModal}>
            <Text style={styles.modalTitle}>{i18n.t('settings.chooseColor')}</Text>

            <ColorPicker
              colors={['red', 'purple', 'blue', 'cyan', 'green', 'yellow', 'orange', 'black', 'white']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 40,
                width: Dimensions.get('window').width * 0.9,
                borderRadius: 20,
                marginVertical: 30,
              }}
              maxWidth={Dimensions.get('window').width * 0.9}
              onColorChanged={onColorChange}
            />

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowColorGradient(false)}
            >
              <Text style={styles.closeModalText}>{i18n.t('settings.close')}</Text>
            </TouchableOpacity>
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
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  colorSelected: {
    borderColor: '#002244',
    borderWidth: 3,
  },
  gradientButtonContainer: {
    marginTop: 12,
    borderWidth: 2,
    borderRadius: 18,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#002244',
  },
  closeModalButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  closeModalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});