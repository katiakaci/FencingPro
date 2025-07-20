import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import LottieView from 'lottie-react-native';

import { useMode } from '../context/ModeContext';
import { useLightColor } from '../context/LightColorContext';
import { useBluetooth } from '../context/BluetoothContext';
import { useSettings } from '../context/SettingsContext';

const COLORS = ['lime', 'red', 'blue', 'yellow', 'purple'];

export default function SettingsScreen() {
  const { mode, setMode } = useMode();
  const { lightColor, setLightColor } = useLightColor();
  const { sendVibrationSetting } = useBluetooth();
  const { soundEnabled, setSoundEnabled, vibrationEnabled, setVibrationEnabled } = useSettings();

  const [language, setLanguage] = useState('fr');

  const toggleMode = useCallback(() => {
    setMode(mode === 'solo' ? 'multi' : 'solo');
  }, [mode, setMode]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  }, []);

  const onVibrationChange = (value) => {
    setVibrationEnabled(value);
    sendVibrationSetting(value); // envoie la commande BLE
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
});