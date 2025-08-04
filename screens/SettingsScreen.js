import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Pressable, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { ColorPicker } from '../components/ColorPicker';
import { Dimensions } from 'react-native';
import { useMode } from '../context/ModeContext';
import { useLightColor } from '../context/LightColorContext';
import { useBluetooth } from '../context/BluetoothContext';
import { useSettings } from '../context/SettingsContext';
import { useHistory } from '../context/HistoryContext';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = ['lime', 'red', 'blue', 'yellow', 'purple'];

const SOUNDS = [
  { name: 'Notification classique', file: 'alert_touch.mp3' },
  { name: 'Bip court', file: 'alert_touch2.mp3' },
  { name: 'Signal', file: 'alert_touch3.mp3' },
  { name: 'Cloche', file: 'alert_touch4.mp3' },
  { name: 'Étincelles', file: 'alert_touch5.mp3' },
  { name: 'Cling', file: 'alert_touch6.mp3' },
  { name: 'Trois points', file: 'alert_touch7.mp3' },
  { name: 'Bulles', file: 'alert_touch8.mp3' },
  { name: 'Sonnette', file: 'alert_touch9.mp3' },
];

const SOUND_FILES = {
  'alert_touch.mp3': require('../assets/sound/alert_touch.mp3'),
  'alert_touch2.mp3': require('../assets/sound/alert_touch2.mp3'),
  'alert_touch3.mp3': require('../assets/sound/alert_touch3.mp3'),
  'alert_touch4.mp3': require('../assets/sound/alert_touch4.mp3'),
  'alert_touch5.mp3': require('../assets/sound/alert_touch5.mp3'),
  'alert_touch6.mp3': require('../assets/sound/alert_touch6.mp3'),
  'alert_touch7.mp3': require('../assets/sound/alert_touch7.mp3'),
  'alert_touch8.mp3': require('../assets/sound/alert_touch8.mp3'),
  'alert_touch9.mp3': require('../assets/sound/alert_touch9.mp3'),
};

export default function SettingsScreen() {
  const { mode, setMode } = useMode();
  const { lightColor, setLightColor } = useLightColor();
  const { sendVibrationSetting, sendColorSetting } = useBluetooth(); // Ajouter sendColorSetting
  const {
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    selectedSound,
    setSelectedSound
  } = useSettings();
  const { clearHistory } = useHistory();

  const [language, setLanguage] = useState('fr');
  const [showSoundPicker, setShowSoundPicker] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showColorGradient, setShowColorGradient] = useState(false);

  const toggleMode = useCallback(() => {
    setMode(mode === 'solo' ? 'multi' : 'solo');
  }, [mode, setMode]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  }, []);

  const onVibrationChange = useCallback((value) => {
    setVibrationEnabled(value);
    sendVibrationSetting(value);
  }, [setVibrationEnabled, sendVibrationSetting]);

  const playPreviewSound = async (soundFile) => {
    try {
      const soundAsset = SOUND_FILES[soundFile];
      if (!soundAsset) return;

      const { sound } = await Audio.Sound.createAsync(soundAsset);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.didJustFinish) sound.unloadAsync();
      });
    } catch (e) {
      console.log('Erreur lecture son:', e);
    }
  };

  const selectSound = useCallback((soundFile) => {
    setSelectedSound(soundFile);
    setShowSoundPicker(false);
  }, [setSelectedSound]);

  const getSelectedSoundName = () => {
    const sound = SOUNDS.find(s => s.file === selectedSound);
    return sound?.name || 'Son par défaut';
  };

  const resetAllData = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        'matchHistory',
        'userStats',
        'gameSettings',
        'playerProfiles'
      ]);

      await clearHistory();

      // Réinitialiser les états
      setMode('solo');
      setLightColor('lime');
      setSoundEnabled(true);
      setVibrationEnabled(true);
      setSelectedSound('alert_touch.mp3');
      setLanguage('fr');
      setShowResetDialog(false);

      alert('Toutes les données ont été réinitialisées avec succès.');
    } catch (error) {
      console.log('Erreur lors de la réinitialisation:', error);
      alert('Erreur lors de la réinitialisation des données.');
    }
  }, [setMode, setLightColor, setSoundEnabled, setVibrationEnabled, setSelectedSound, clearHistory]);

  // Fonction pour changer la couleur et l'envoyer via BLE
  const handleColorChange = useCallback((color) => {
    // console.log('Changement de couleur:', color);
    setLightColor(color);
    if (sendColorSetting) {
      sendColorSetting(color);
    }
  }, [setLightColor, sendColorSetting]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animation/backgroundWelcomeScreen.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={styles.backgroundAnimation}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentWrapper}
        showsVerticalScrollIndicator={false}
      >
        {/* Mode solo/multijoueurs*/}
        <View style={styles.settingBlock}>
          <View style={styles.row}>
            <Text style={styles.label}>Mode</Text>
            <Pressable style={styles.actionButton} onPress={toggleMode}>
              <Text style={styles.actionButtonText}>
                {mode === 'solo' ? 'Multijoueur' : 'Solo'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Couleurs des lumières */}
        <View style={styles.settingBlock}>
          <Text style={styles.label}>Couleurs des lumières</Text>
          <View style={styles.colorRow}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => handleColorChange(color)}
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
              {
                marginTop: 12,
                borderWidth: 1,
                borderColor: '#fff',
                borderRadius: 18,
                overflow: 'hidden',
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
                Autres couleurs
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Son/Vibration */}
        <View style={styles.settingBlock}>
          <View style={styles.row}>
            <Text style={styles.label}>Son</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#ccc', true: '#0a3871' }}
              thumbColor="#fff"
            />
          </View>

          {/* Sélection du son */}
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
            <Text style={styles.label}>Vibration</Text>
            <Switch
              value={vibrationEnabled}
              onValueChange={onVibrationChange}
              trackColor={{ false: '#ccc', true: '#0a3871' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Langue */}
        <View style={styles.settingBlock}>
          <View style={styles.row}>
            <Text style={styles.label}>Langue</Text>
            <Pressable style={styles.actionButton} onPress={toggleLanguage}>
              <Text style={styles.actionButtonText}>
                {language === 'fr' ? 'English' : 'Français'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Réinitialisation */}
        <View style={styles.settingBlock}>
          <View style={styles.row}>
            <Text style={styles.label}>Réinitialiser</Text>
            <Pressable style={styles.resetButton} onPress={() => setShowResetDialog(true)}>
              <Text style={styles.resetButtonText}>Tout effacer</Text>
            </Pressable>
          </View>
          <Text style={styles.resetWarning}>
            Supprime définitivement toutes les données (historique, statistiques, réglages)
          </Text>
        </View>
      </ScrollView>

      {/* Modal sélection du son */}
      <Modal
        visible={showSoundPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSoundPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.soundModal}>
            <Text style={styles.modalTitle}>Choisir une sonnerie</Text>

            <ScrollView style={styles.soundList}>
              {SOUNDS.map((sound) => (
                <View key={sound.file} style={styles.soundItem}>
                  <TouchableOpacity
                    style={[
                      styles.soundOption,
                      selectedSound === sound.file && styles.selectedSoundOption
                    ]}
                    onPress={() => selectSound(sound.file)}
                  >
                    <Text style={[
                      styles.soundOptionText,
                      selectedSound === sound.file && styles.selectedSoundText
                    ]}>
                      {sound.name}
                    </Text>
                    {selectedSound === sound.file && (
                      <Ionicons name="checkmark" size={20} color="#007bff" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => playPreviewSound(sound.file)}
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
              <Text style={styles.closeModalText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
            <Text style={styles.resetModalTitle}>Réinitialiser toutes les données ?</Text>
            <Text style={styles.resetModalText}>
              Cette action supprimera définitivement :
              {'\n'}• Tout l'historique des parties
              {'\n'}• Toutes les statistiques
              {'\n'}• Tous les réglages personnalisés
              {'\n\n'}Cette action est irréversible.
            </Text>

            <View style={styles.resetButtonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowResetDialog(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmResetButton}
                onPress={resetAllData}
              >
                <Text style={styles.confirmResetButtonText}>Tout effacer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* modal des couleurs */}
      <Modal
        visible={showColorGradient}
        transparent
        animationType="slide"
        onRequestClose={() => setShowColorGradient(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.soundModal, { alignItems: 'center' }]}>
            <Text style={styles.modalTitle}>Choisir une couleur</Text>

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
              onColorChanged={useCallback((color) => {
                handleColorChange(color); // Utiliser handleColorChange
              }, [handleColorChange])}
            />

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowColorGradient(false)}
            >
              <Text style={styles.closeModalText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundAnimation: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: -1,
  },
  scrollView: {
    flex: 1,
  },
  contentWrapper: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
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
  actionButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  gradientButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
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
});