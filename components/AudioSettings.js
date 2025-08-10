/**
 * @fileoverview Composant de configuration audio et vibration
 * 
 * Ce composant gère :
 * - L'activation/désactivation des sons de touche
 * - La sélection du son d'alerte parmi les options disponibles
 * - L'activation/désactivation de la vibration
 * - La modal de sélection des sons avec prévisualisation
 * 
 * Fonctionnalités :
 * - Switch pour activer/désactiver le son
 * - Bouton de sélection du son (visible seulement si son activé)
 * - Switch pour la vibration avec envoi Bluetooth
 * - Modal avec liste des sons et boutons de prévisualisation
 */
import React from 'react';
import { View, Text, Switch, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../languages/i18n';

export const AudioSettings = ({
  soundEnabled,
  setSoundEnabled,
  vibrationEnabled,
  onVibrationChange,
  selectedSound,
  getSelectedSoundName,
  showSoundPicker,
  setShowSoundPicker,
  sounds,
  onSoundSelect,
  onPlayPreview
}) => {
  return (
    <>
      <View style={styles.settingBlock}>
        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('settings.sound')}</Text>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: '#ccc', true: '#0a3871' }}
            thumbColor="#fff"
          />
        </View>

        {soundEnabled && (
          <View style={styles.soundRow}>
            <TouchableOpacity
              style={styles.soundButton}
              onPress={() => setShowSoundPicker(true)}
            >
              <Text style={styles.soundButtonText}>{getSelectedSoundName()}</Text>
              <Ionicons name="chevron-down" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('settings.vibration')}</Text>
          <Switch
            value={vibrationEnabled}
            onValueChange={onVibrationChange}
            trackColor={{ false: '#ccc', true: '#0a3871' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Modal sélection du son */}
      <Modal
        visible={showSoundPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSoundPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.soundModal}>
            <Text style={styles.modalTitle}>{i18n.t('settings.chooseSound')}</Text>

            <ScrollView style={styles.soundList}>
              {sounds.map((sound) => (
                <View key={sound.file} style={styles.soundItem}>
                  <TouchableOpacity
                    style={[
                      styles.soundOption,
                      selectedSound === sound.file && styles.selectedSoundOption
                    ]}
                    onPress={() => onSoundSelect(sound.file)}
                  >
                    <Text style={[
                      styles.soundOptionText,
                      selectedSound === sound.file && styles.selectedSoundText
                    ]}>
                      {i18n.t(`settings.${sound.name}`)}
                    </Text>
                    {selectedSound === sound.file && (
                      <Ionicons name="checkmark" size={20} color="#007bff" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => onPlayPreview(sound.file)}
                  >
                    <Ionicons name="play" size={16} color="#007bff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowSoundPicker(false)}
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
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  soundRow: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  soundButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  soundButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#002244',
  },
  soundList: {
    maxHeight: 300,
  },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  soundOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  selectedSoundOption: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  soundOptionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  selectedSoundText: {
    color: '#007bff',
    fontWeight: '600',
  },
  playButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
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