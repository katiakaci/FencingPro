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
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('fr'); // vérifier francais pas défaut ou anglais ?

  const toggleMode = () => {
    setMode(mode === 'solo' ? 'multi' : 'solo');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réglages</Text>

      {/* Mode solo/multijoueur */}
      <View style={styles.row}>
        <Text style={styles.label}>Mode : {mode === 'solo' ? 'Solo' : 'Multijoueur'}</Text>
        <Switch value={mode === 'solo'} onValueChange={toggleMode} />
      </View>

      {/* Couleurs des lumières */}
      <Text style={styles.sectionTitle}>Couleur des lumières</Text>
      <View style={styles.colorOptions}>
        {couleurs.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => setLightColor(color)}
            style={[
              styles.colorButton,
              { backgroundColor: color },
              lightColor === color && styles.colorSelected,
            ]}
          />
        ))}
      </View>

      {/* Son */}
      <View style={styles.row}>
        <Text style={styles.label}>Son</Text>
        <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
      </View>

      {/* Vibration */}
      <View style={styles.row}>
        <Text style={styles.label}>Vibration</Text>
        <Switch value={vibrationEnabled} onValueChange={setVibrationEnabled} />
      </View>

      {/* Thème */}
      <View style={styles.row}>
        <Text style={styles.label}>Mode nuit</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      {/* Langue */}
      <View style={styles.row}>
        <Text style={styles.label}>Langue : {language === 'fr' ? 'Français' : 'English'}</Text>
        <Pressable
          onPress={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          style={styles.languageButton}
        >
          <Text style={styles.languageButtonText}>
            Changer en {language === 'fr' ? 'English' : 'Français'}
          </Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  label: {
    fontSize: 18,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  colorSelected: {
    borderColor: 'black',
    borderWidth: 3,
  },
  languageButton: {
    backgroundColor: '#007acc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  languageButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
