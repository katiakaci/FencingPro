import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';

import { useLightColor } from '../context/LightColorContext';
import { useBluetooth } from '../context/BluetoothContext';
import { useSettings } from '../context/SettingsContext';

import { useAudio } from '../hooks/useAudio';
import { useLanguage } from '../hooks/useLanguage';
import { useSettingsReset } from '../hooks/useSettingsReset';

import { ColorSettings } from '../components/Settings/ColorSettings';
import { AudioSettings } from '../components/Settings/AudioSettings';
import { LanguageSettings } from '../components/Settings/LanguageSettings';
import { ResetSettings } from '../components/Settings/ResetSettings';

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

  // Hooks personnalisés
  const { playPreviewSound, getSelectedSoundName, SOUNDS } = useAudio();
  const { 
    currentLanguage, 
    toggleLanguage, 
    changeLanguage, 
    availableLanguages, 
    getCurrentLanguageInfo 
  } = useLanguage();
  const { resetAllData } = useSettingsReset();

  // États locaux pour les modals
  const [showSoundPicker, setShowSoundPicker] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showColorGradient, setShowColorGradient] = useState(false);

  const onVibrationChange = useCallback((value) => {
    setVibrationEnabled(value);
    sendVibrationSetting(value);
  }, [setVibrationEnabled, sendVibrationSetting]);

  const selectSound = useCallback((soundFile) => {
    setSelectedSound(soundFile);
  }, [setSelectedSound]);

  const handleColorChange = useCallback((color) => {
    setLightColor(color);
    if (sendColorSetting) {
      sendColorSetting(color);
    }
  }, [setLightColor, sendColorSetting]);

  const handleResetData = useCallback(async (onSuccess, onError) => {
    await resetAllData(onSuccess, onError);
  }, [resetAllData]);

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
        <ColorSettings
          lightColor={lightColor}
          onColorChange={handleColorChange}
          showColorGradient={showColorGradient}
          setShowColorGradient={setShowColorGradient}
        />

        <AudioSettings
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          vibrationEnabled={vibrationEnabled}
          onVibrationChange={onVibrationChange}
          selectedSound={selectedSound}
          getSelectedSoundName={() => getSelectedSoundName(selectedSound)}
          showSoundPicker={showSoundPicker}
          setShowSoundPicker={setShowSoundPicker}
          sounds={SOUNDS}
          onSoundSelect={selectSound}
          onPlayPreview={playPreviewSound}
        />

        <LanguageSettings
          currentLanguage={currentLanguage}
          onLanguageToggle={toggleLanguage}
          availableLanguages={availableLanguages}
          getCurrentLanguageInfo={getCurrentLanguageInfo}
          onLanguageChange={changeLanguage}
        />

        <ResetSettings
          showResetDialog={showResetDialog}
          setShowResetDialog={setShowResetDialog}
          onResetData={handleResetData}
        />
      </ScrollView>
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
});