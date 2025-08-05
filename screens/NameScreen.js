import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function NameScreen({ navigation }) {
  const [playerName, setPlayerName] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState(null);

  const handleWeaponSelect = (weapon) => {
    setSelectedWeapon(weapon);
  };

  const handleOk = () => {
    if (playerName && selectedWeapon) {
      navigation.navigate('Game', { joueur1: playerName, arme1: selectedWeapon });
    } else {
      alert('Veuillez entrer un nom et sélectionner une arme.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>


      <View style={styles.screenName}>
        <Text style={styles.label}>Entrez le nom du joueur 1</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom du joueur"
          value={playerName}
          onChangeText={setPlayerName}
        />

        <Text style={styles.label}>Sélectionnez votre arme</Text>
        <View style={styles.weaponContainer}>
          <TouchableOpacity
            style={[styles.weaponButton, selectedWeapon === 'sabre' && styles.weaponSelected]}
            onPress={() => handleWeaponSelect('sabre')}
          >
            <Text style={styles.weaponText}>Sabre</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.weaponButton, selectedWeapon === 'fleuret' && styles.weaponSelected]}
            onPress={() => handleWeaponSelect('fleuret')}
          >
            <Text style={styles.weaponText}>Fleuret</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.okButton} onPress={handleOk}>
          <Text style={styles.okText}>OK</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screenName: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginVertical: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  weaponContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  weaponButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    width: 120,
  },
  weaponSelected: {
    backgroundColor: '#cceeff',
    borderColor: '#007acc',
  },
  weaponText: {
    fontSize: 16,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
  },
  okButton: {
    marginTop: 20,
    backgroundColor: '#007acc',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  okText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
