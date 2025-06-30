import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useMode } from '../context/ModeContext';
import { useLightColor } from '../context/LightColorContext';
import LottieView from 'lottie-react-native';

const COLORS = ['lime', 'red', 'blue', 'yellow', 'purple'];

export default function SettingsScreen() {
  const navigation = useNavigation();
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

      {/* Header */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Ionicons name="menu" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Réglages</Text>
      </View>

      {/* 2 petites barres blanches */}
      <View style={styles.whiteSeparator} />
      <View style={styles.whiteSeparator2} />

      {/* Page principale */}
      <View style={styles.contentWrapper}>
        {/* Mode solo/multijoueurs*/}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundAnimation: {
    ...StyleSheet.absoluteFillObject,
  },
  appBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'rgba(74,171,232,0.30)',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 16,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  menuButton: {
    marginRight: 16,
  },
  appBarTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  whiteSeparator: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.95)',
    width: '100%',
    zIndex: 9,
    marginTop: 90,
  },
  whiteSeparator2: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.95)',
    width: '100%',
    zIndex: 9,
    marginTop: 2,
  },
  settingBlock: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 16,
    borderRadius: 24,
    marginBottom: 24,
    justifyContent: 'center',
    marginHorizontal: 24,
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
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});