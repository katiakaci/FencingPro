import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Pressable, Modal, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { useLightColor } from '../context/LightColorContext';
import { useBluetooth } from '../context/BluetoothContext';
import { useSettings } from '../context/SettingsContext';
import { useHistory } from '../context/HistoryContext';
import { ColorSettings } from '../components/ColorSettings';
import i18n from '../languages/i18n';

const SOUNDS = [
  { name: 'sounds.classic', file: 'alert_touch.mp3' },
  { name: 'sounds.shortBeep', file: 'alert_touch2.mp3' },
  { name: 'sounds.signal', file: 'alert_touch3.mp3' },
  { name: 'sounds.bell', file: 'alert_touch4.mp3' },
  { name: 'sounds.sparkles', file: 'alert_touch5.mp3' },
  { name: 'sounds.cling', file: 'alert_touch6.mp3' },
  { name: 'sounds.threePoints', file: 'alert_touch7.mp3' },
  { name: 'sounds.bubbles', file: 'alert_touch8.mp3' },
  { name: 'sounds.doorbell', file: 'alert_touch9.mp3' },
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
  const { lightColor, setLightColor } = useLightColor();
  const { sendVibrationSetting, sendColorSetting } = useBluetooth();
  const {
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    selectedSound,
    setSelectedSound
  } = useSettings();
  const { clearHistory } = useHistory();

  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [showSoundPicker, setShowSoundPicker] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showColorGradient, setShowColorGradient] = useState(false);

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('userLanguage');
        if (savedLanguage) {
          i18n.changeLanguage(savedLanguage);
          setCurrentLanguage(savedLanguage);
        }
      } catch (error) {
        console.log('Erreur chargement langue:', error);
      }
    };

    loadSavedLanguage();
  }, []);

  const toggleLanguage = useCallback(async () => {
    const newLang = currentLanguage === 'fr' ? 'en' : 'fr';

    try {
      await i18n.changeLanguage(newLang);
      setCurrentLanguage(newLang);
      await AsyncStorage.setItem('userLanguage', newLang);
    } catch (error) {
      console.log('Erreur changement langue:', error);
    }
  }, [currentLanguage]);

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
    return sound ? i18n.t(`settings.${sound.name}`) : i18n.t('settings.sounds.classic');
  };

  const resetAllData = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        'matchHistory',
        'userStats',
        'gameSettings',
        'playerProfiles',
        'userLanguage'
      ]);

      await clearHistory();

      setLightColor('lime');
      setSoundEnabled(true);
      setVibrationEnabled(true);
      setSelectedSound('alert_touch.mp3');

      // Réinitialiser la langue
      await i18n.changeLanguage('fr');
      setCurrentLanguage('fr');

      setShowResetDialog(false);

      Alert.alert('', i18n.t('settings.resetSuccess'));
    } catch (error) {
      console.log('Erreur lors de la réinitialisation:', error);
      Alert.alert('', i18n.t('settings.resetError'));
    }
  }, [setLightColor, setSoundEnabled, setVibrationEnabled, setSelectedSound, clearHistory]);

  const handleColorChange = useCallback((color) => {
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
        {/* Couleurs des lumières */}
        <ColorSettings 
          lightColor={lightColor}
          onColorChange={handleColorChange}
          showColorGradient={showColorGradient}
          setShowColorGradient={setShowColorGradient}
        />

        {/* Son/Vibration */}
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

        {/* Langue */}
        <View style={styles.settingBlock}>
          <View style={styles.row}>
            <Text style={styles.label}>{i18n.t('settings.language')}</Text>
            <Pressable style={styles.actionButton} onPress={toggleLanguage}>
              <Text style={styles.actionButtonText}>
                {currentLanguage === 'fr' ? 'English' : 'Français'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Réinitialisation */}
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
            <Text style={styles.modalTitle}>{i18n.t('settings.chooseSound')}</Text>

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
                      {i18n.t(`settings.${sound.name}`)}
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
              <Text style={styles.closeModalText}>{i18n.t('settings.close')}</Text>
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
                onPress={resetAllData}
              >
                <Text style={styles.confirmResetButtonText}>{i18n.t('settings.resetAll')}</Text>
              </TouchableOpacity>
            </View>
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
});