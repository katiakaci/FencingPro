import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useMode } from '../context/ModeContext';
import { useLightColor } from '../context/LightColorContext';
import LottieView from 'lottie-react-native';

const COLORS = ['lime', 'red', 'blue', 'yellow', 'purple'];

export default function SettingsScreen() {
  const { mode, setMode } = useMode();
  const { lightColor, setLightColor } = useLightColor();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [language, setLanguage] = useState('fr');

  const toggleMode = useCallback(() => {
    setMode(mode === 'solo' ? 'multi' : 'solo');
  }, [mode, setMode]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'fr' ? 'en' : 'fr'));
  }, []);

  return (
    <View style={styles.container}>
      {/* Animation background */}
      <LottieView
        source={require('../assets/animation/backgroundWelcomeScreen.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={styles.backgroundAnimation}
      />

      <Text style={styles.title}>Réglages</Text>

      {/* Mode */}
      <View style={styles.settingBlock}>
        <Text style={styles.label}>Mode</Text>
        <View style={styles.row}>
          <Text style={styles.value}>{mode === 'solo' ? 'Solo' : 'Multijoueur'}</Text>
          <Switch
            value={mode === 'solo'}
            onValueChange={toggleMode}
            trackColor={{ false: '#ccc', true: '#0a3871' }}
            thumbColor="#fff"
          />
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
          <Text style={[styles.label, { flex: 1 }]}>Son</Text>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: '#ccc', true: '#0a3871' }}
            thumbColor="#fff"
          />
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { flex: 1 }]}>Vibration</Text>
          <Switch
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            trackColor={{ false: '#ccc', true: '#0a3871' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Langue */}
      <View style={styles.settingBlock}>
        <View style={styles.row}>
          <Text style={[styles.label, { flex: 1 }]}>Langue</Text>
          <Pressable style={styles.languageButton} onPress={toggleLanguage}>
            <Text style={styles.languageButtonText}>
              {language === 'fr' ? 'English' : 'Français'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#79D9C4',
    padding: 24,
  },
  backgroundAnimation: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#002244',
    textAlign: 'center',
    marginBottom: 24,
  },
  settingBlock: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 16,
    borderRadius: 24,
    marginBottom: 24,
    justifyContent: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: '#002244',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    color: '#002244',
    marginRight: 12,
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
  languageButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
