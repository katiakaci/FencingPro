import React, { useState } from 'react';
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

export default function SettingsScreen() {
  const { mode, setMode } = useMode();
  const { lightColor, setLightColor } = useLightColor();

  const couleurs = ['lime', 'red', 'blue', 'yellow', 'purple'];

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [language, setLanguage] = useState('fr');

  const toggleMode = () => {
    setMode(mode === 'solo' ? 'multi' : 'solo');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réglages</Text>

      {/* Bloc Mode */}
      <View style={styles.settingBlock}>
        <Text style={styles.label}>Mode</Text>
        <View style={styles.row}>
          <Text style={styles.value}>{mode === 'solo' ? 'Solo' : 'Multijoueur'}</Text>
          <Switch
            value={mode === 'solo'}
            onValueChange={toggleMode}
            trackColor={{ false: '#ccc', true: '#0a3871' }}
            thumbColor={'#fff'}
          />
        </View>
      </View>

      {/* Couleurs des lumières */}
      <View style={styles.settingBlock}>
        <Text style={styles.label}>Couleurs des lumières</Text>
        <View style={styles.colorRow}>
          {couleurs.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setLightColor(color)}
              style={[
                styles.colorDot,
                { backgroundColor: color },
                lightColor === color && styles.colorSelected,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Son/Vibration */}
      <View style={styles.settingBlock}>
        <Text style={styles.label}>Son</Text>
        <Switch
          value={soundEnabled}
          onValueChange={setSoundEnabled}
          trackColor={{ false: '#ccc', true: '#0a3871' }}
          thumbColor={'#fff'}
        />
        <Text style={[styles.label, { marginTop: 20 }]}>Vibration</Text>
        <Switch
          value={vibrationEnabled}
          onValueChange={setVibrationEnabled}
          trackColor={{ false: '#ccc', true: '#0a3871' }}
          thumbColor={'#fff'}
        />
      </View>

      {/* Langue */}
      <View style={styles.languageRow}>
        <Text style={styles.languageText}>Language</Text>
        <Pressable
          style={styles.languageButton}
          onPress={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
        >
          <Text style={styles.languageButtonText}>
            Change to {language === 'fr' ? 'English' : 'Français'}
          </Text>
        </Pressable>
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
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: '#002244',
    marginBottom: 8,
    // lineHeight: 24,
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
  languageRow: {
    marginTop: 20,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 18,
    color: '#002244',
    marginBottom: 12,
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
