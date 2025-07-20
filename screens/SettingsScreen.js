import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';

import { useMode } from '../context/ModeContext';
import { useLightColor } from '../context/LightColorContext';
import { useBluetooth } from '../context/BluetoothContext';
import { useSettings } from '../context/SettingsContext';

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

// Mapping statique des fichiers audio
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
  const { sendVibrationSetting } = useBluetooth();
  const { 
    soundEnabled, 
    setSoundEnabled, 
    vibrationEnabled, 
    setVibrationEnabled,
    selectedSound,
    setSelectedSound 
  } = useSettings();

  const [language, setLanguage] = useState('fr');
  const [showSoundPicker, setShowSoundPicker] = useState(false);

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
      if (!soundAsset) {
        console.log('Fichier son non trouvé:', soundFile);
        return;
      }
      
      const { sound } = await Audio.Sound.createAsync(soundAsset);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.didJustFinish) sound.unloadAsync();
      });
    } catch (e) {
      console.log('Erreur lecture son:', e);
    }
  };

  const selectSound = (soundFile) => {
    setSelectedSound(soundFile);
    setShowSoundPicker(false);
  };

  const getSelectedSoundName = () => {
    const sound = SOUNDS.find(s => s.file === selectedSound);
    return sound ? sound.name : 'Son par défaut';
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animation/backgroundWelcomeScreen.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={styles.backgroundAnimation}
      />

      <View style={styles.contentWrapper}>
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
                onPress={() => setLightColor(color)}
                style={[
                  styles.colorDot,
                  { backgroundColor: color },
                  lightColor === color && styles.colorSelected,
                ]}
                accessibilityLabel={`Choisir la couleur ${color}`}
              />
            ))}
          </View>
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
            <View style={styles.row}>
              <Text style={[styles.label, { fontSize: 16 }]}>Sonnerie</Text>
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
      </View>
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
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
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
  soundButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 200,
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