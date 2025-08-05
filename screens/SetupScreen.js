import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { BleManager } from 'react-native-ble-plx';

const weapons = ['Sabre', 'Fleuret'];

export default function SetupScreen({ navigation }) {
  const [mode, setMode] = useState('solo');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [selectedWeapon2, setSelectedWeapon2] = useState(null);
  const [bleConnected, setBleConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [manager] = useState(new BleManager());

  const scanForDevices = () => {
    setDevices([]);
    setLoading(true);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        setLoading(false);
        return;
      }
      if ((device?.id === 'C8:D5:62:67:18:D9' || device?.id === 'C9:72:3C:84:6C:BE') && !devices.find(d => d.id === device.id)) {
        setDevices([device]);
        manager.stopDeviceScan(); // Stop scan when found
        setLoading(false);
      }
    });
    setTimeout(() => {
      manager.stopDeviceScan();
      setLoading(false);
    }, 8000);
  };

  const connectToDevice = async (device) => {
    setLoading(true);
    try {
      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      setBleConnected(true);
      setLoading(false);
      Alert.alert('Connecté', `Périphérique: ${connected.name || '(aucun nom)'}`);
    } catch (err) {
      setLoading(false);
      Alert.alert('Erreur', 'Impossible de se connecter au périphérique BLE');
    }
  };

  const canStart = mode === 'solo'
    ? player1.trim() && selectedWeapon && bleConnected
    : player1.trim() && player2.trim() && selectedWeapon && selectedWeapon2 && bleConnected;

  const handleStart = () => {
    if (!bleConnected) {
      Alert.alert('Erreur', "Veuillez connecter l'appareil BLE");
      return;
    }
    if (!player1.trim() || (mode === 'multi' && !player2.trim())) {
      Alert.alert('Erreur', 'Veuillez entrer le(s) nom(s) du ou des joueur(s)');
      return;
    }
    if (!selectedWeapon || (mode === 'multi' && !selectedWeapon2)) {
      Alert.alert('Erreur', 'Veuillez sélectionner une arme pour chaque joueur');
      return;
    }
    navigation.replace('Main', {
      joueur1: player1,
      joueur2: player2,
      arme1: selectedWeapon,
      arme2: selectedWeapon2,
      mode,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <LottieView
          source={require('../assets/animation/backgroundWelcomeScreen.json')}
          autoPlay
          loop
          resizeMode="cover"
          style={styles.backgroundAnimation}
        />

        {/* Bouton retour */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Bienvenue')}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.contentWrapper} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={true}>
          <Text style={styles.title}>Préparation</Text>

          {/* Mode */}
          <View style={styles.block}>
            <Text style={styles.label}>Mode</Text>
            <View style={styles.row}>
              <TouchableOpacity style={[styles.modeButton, mode === 'solo' && styles.selected]} onPress={() => setMode('solo')}>
                <Text style={styles.modeText}>Solo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeButton, mode === 'multi' && styles.selected]} onPress={() => setMode('multi')}>
                <Text style={styles.modeText}>Multijoueur</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Noms joueurs */}
          <View style={styles.block}>
            <Text style={styles.label}>Nom du joueur 1</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom du joueur 1"
              value={player1}
              onChangeText={setPlayer1}
            />
            {mode === 'multi' && (
              <>
                <Text style={styles.label}>Nom du joueur 2</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nom du joueur 2"
                  value={player2}
                  onChangeText={setPlayer2}
                />
              </>
            )}
          </View>

          {/* Arme joueur 1 */}
          <View style={styles.block}>
            <Text style={styles.label}>Type d'arme - Joueur 1</Text>
            <View style={styles.row}>
              {weapons.map((weapon) => (
                <TouchableOpacity
                  key={weapon}
                  style={[styles.weaponButton, selectedWeapon === weapon && styles.selected]}
                  onPress={() => setSelectedWeapon(weapon)}
                >
                  <Text style={styles.modeText}>{weapon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Arme joueur 2 (si mode multi) */}
          {mode === 'multi' && (
            <View style={styles.block}>
              <Text style={styles.label}>Type d'arme - Joueur 2</Text>
              <View style={styles.row}>
                {weapons.map((weapon) => (
                  <TouchableOpacity
                    key={weapon}
                    style={[styles.weaponButton, selectedWeapon2 === weapon && styles.selected]}
                    onPress={() => setSelectedWeapon2(weapon)}
                  >
                    <Text style={styles.modeText}>{weapon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Bluetooth */}
          <View style={styles.block}>
            <Text style={styles.label}>Appareil Bluetooth</Text>
            <TouchableOpacity style={styles.scanButton} onPress={scanForDevices} disabled={loading || bleConnected}>
              <Text style={styles.scanText}>{bleConnected ? 'Connecté' : loading ? 'Scan...' : 'Scanner'}</Text>
            </TouchableOpacity>
            {!bleConnected && !loading && devices.length === 0 && (
              <Text style={styles.noDeviceText}>Aucun appareil trouvé</Text>
            )}
            {!bleConnected && devices.length > 0 && (
              <View style={styles.deviceList}>
                {devices.map((device) => (
                  <TouchableOpacity key={device.id} style={styles.deviceItem} onPress={() => connectToDevice(device)}>
                    <Text style={styles.deviceName}>{device.name || 'Module BLE'}</Text>
                    <Text style={styles.deviceId}>{device.id}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {loading && <ActivityIndicator size="small" color="#007acc" style={{ marginTop: 10 }} />}
          </View>

          {/* Bouton Commencer */}
          <TouchableOpacity
            style={[styles.startButton, !canStart && { opacity: 0.5 }]}
            onPress={handleStart}
            disabled={!canStart}
          >
            <Text style={styles.startText}>Commencer la partie</Text>
          </TouchableOpacity>

          {/* Bouton DEV : Commencer sans BLE */}
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: '#ffb347', marginTop: 8 }]}
            onPress={() => {
              if (!player1.trim() || (mode === 'multi' && !player2.trim())) {
                Alert.alert('Erreur', 'Veuillez entrer le(s) nom(s) du ou des joueur(s)');
                return;
              }
              if (!selectedWeapon || (mode === 'multi' && !selectedWeapon2)) {
                Alert.alert('Erreur', 'Veuillez sélectionner une arme pour chaque joueur');
                return;
              }
              navigation.replace('Main', {
                joueur1: player1,
                joueur2: player2,
                arme1: selectedWeapon,
                arme2: selectedWeapon2,
                mode,
              });
            }}
            disabled={mode === 'solo'
              ? !player1.trim() || !selectedWeapon
              : !player1.trim() || !player2.trim() || !selectedWeapon || !selectedWeapon2
            }
          >
            <Text style={[styles.startText, { color: '#111' }]}>DEV : Commencer sans BLE</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundAnimation: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: 'black',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 1,
  },
  contentWrapper: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    marginTop: 8,
  },
  block: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 7,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 6,
  },
  modeButton: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: '#007acc',
  },
  selected: {
    backgroundColor: '#007acc',
    borderColor: '#005a99',
  },
  modeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111',
  },
  weaponButton: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: '#007acc',
  },
  scanButton: {
    backgroundColor: '#007acc',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  scanText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 13,
  },
  deviceList: {
    marginTop: 6,
  },
  deviceItem: {
    backgroundColor: '#fff',
    padding: 7,
    borderRadius: 7,
    marginBottom: 6,
    alignItems: 'center',
  },
  deviceName: {
    fontWeight: 'bold',
    color: '#007acc',
    fontSize: 13,
  },
  deviceId: {
    fontSize: 10,
    color: '#555',
  },
  startButton: {
    backgroundColor: '#00c9a7',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
    maxWidth: 340,
  },
  startText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 15,
  },
  noDeviceText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
    fontSize: 13,
  },
});
