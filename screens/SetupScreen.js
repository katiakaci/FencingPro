import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useBluetooth } from '../context/BluetoothContext';
import { useTouch } from '../context/TouchContext';
import { ModeSelector } from '../components/Setup/ModeSelector';
import { PlayerInputs } from '../components/Setup/PlayerInputs';
import { WeaponSelector } from '../components/Setup/WeaponSelector';
import i18n from '../languages/i18n';

export default function SetupScreen({ navigation }) {
  const [mode, setMode] = useState('solo');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [selectedWeapon2, setSelectedWeapon2] = useState(null);

  // États Bluetooth pour joueur 1
  const [bleConnected1, setBleConnected1] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [devices1, setDevices1] = useState([]);
  const [connectedDevice1, setConnectedDevice1] = useState(null);

  // États Bluetooth pour joueur 2
  const [bleConnected2, setBleConnected2] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [devices2, setDevices2] = useState([]);
  const [connectedDevice2, setConnectedDevice2] = useState(null);

  const { manager, sendWeaponSetting, setDevice } = useBluetooth();
  const { setTouchDetected } = useTouch();

  const scanForDevices1 = () => {
    setDevices1([]);
    setLoading1(true);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        setLoading1(false);
        return;
      }
      if ((device?.id === 'C8:D5:62:67:18:D9' || device?.id === 'C9:72:3C:84:6C:BE' || device?.id === 'CC:69:E0:C8:E7:FA') &&
        (!connectedDevice2 || device.id !== connectedDevice2.id)) {
        setDevices1(prev => {
          const exists = prev.find(d => d.id === device.id);
          if (!exists) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });
    setTimeout(() => {
      manager.stopDeviceScan();
      setLoading1(false);
    }, 8000);
  };

  const scanForDevices2 = () => {
    setDevices2([]);
    setLoading2(true);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        setLoading2(false);
        return;
      }
      if ((device?.id === 'C8:D5:62:67:18:D9' || device?.id === 'C9:72:3C:84:6C:BE') &&
        (!connectedDevice1 || device.id !== connectedDevice1.id)) {
        setDevices2(prev => {
          const exists = prev.find(d => d.id === device.id);
          if (!exists) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });
    setTimeout(() => {
      manager.stopDeviceScan();
      setLoading2(false);
    }, 8000);
  };

  const connectToDevice1 = async (device) => {
    setLoading1(true);
    try {
      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      setBleConnected1(true);
      setConnectedDevice1(connected);
      setDevice(connected);
      setDevices1([]);
      setLoading1(false);
      Alert.alert(i18n.t('setup.connected'));
    } catch (err) {
      setLoading1(false);
      Alert.alert(i18n.t('common.error'), i18n.t('setup.connectionErrorPlayer1'));
    }
  };

  const connectToDevice2 = async (device) => {
    setLoading2(true);
    try {
      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      setBleConnected2(true);
      setConnectedDevice2(connected);
      setDevices2([]);
      setLoading2(false);
      Alert.alert(i18n.t('setup.connected'));
    } catch (err) {
      setLoading2(false);
      Alert.alert(i18n.t('common.error'), i18n.t('setup.connectionErrorPlayer2'));
    }
  };

  const canStart = mode === 'solo'
    ? player1.trim() && selectedWeapon && bleConnected1
    : player1.trim() && player2.trim() && selectedWeapon && selectedWeapon2 && bleConnected1 && bleConnected2;

  const handleStart = async () => {
    if (mode === 'solo' && !bleConnected1) {
      Alert.alert(i18n.t('common.error'), i18n.t('setup.errorBleConnection'));
      return;
    }
    if (mode === 'multi' && (!bleConnected1 || !bleConnected2)) {
      Alert.alert(i18n.t('common.error'), i18n.t('setup.errorBleConnectionMulti'));
      return;
    }
    if (!player1.trim() || (mode === 'multi' && !player2.trim())) {
      Alert.alert(i18n.t('common.error'), i18n.t('setup.errorPlayerNames'));
      return;
    }
    if (!selectedWeapon || (mode === 'multi' && !selectedWeapon2)) {
      Alert.alert(i18n.t('common.error'), i18n.t('setup.errorWeaponSelection'));
      return;
    }

    // Envoyer le type d'arme aux appareils connectés
    if (connectedDevice1) {
      await sendWeaponSetting(selectedWeapon, connectedDevice1);
    }

    if (mode === 'multi' && connectedDevice2) {
      await sendWeaponSetting(selectedWeapon2, connectedDevice2);
    }

    console.log('Navigation vers Main avec:', {
      joueur1: player1,
      joueur2: player2,
      arme1: selectedWeapon,
      arme2: selectedWeapon2,
      device1: connectedDevice1,
      device2: connectedDevice2,
      mode,
    });

    navigation.navigate('Main', {
      screen: 'Game',
      params: {
        joueur1: player1,
        joueur2: player2,
        arme1: selectedWeapon,
        arme2: selectedWeapon2,
        device1: connectedDevice1,
        device2: connectedDevice2,
        mode,
      }
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

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Bienvenue')}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.contentWrapper}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <Text style={styles.title}>{i18n.t('setup.title')}</Text>

          {/* Mode */}
          <ModeSelector mode={mode} onModeChange={setMode} />

          {/* Noms joueurs */}
          <PlayerInputs
            mode={mode}
            player1={player1}
            setPlayer1={setPlayer1}
            player2={player2}
            setPlayer2={setPlayer2}
          />

          {/* Armes */}
          <WeaponSelector
            mode={mode}
            selectedWeapon={selectedWeapon}
            setSelectedWeapon={setSelectedWeapon}
            selectedWeapon2={selectedWeapon2}
            setSelectedWeapon2={setSelectedWeapon2}
          />

          {/* Bluetooth Joueur 1 */}
          <View style={styles.block}>
            <Text style={styles.label}>
              {mode === 'solo' ? i18n.t('setup.bluetoothDevice') : i18n.t('setup.bluetoothDevicePlayer1')}
            </Text>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={scanForDevices1}
              disabled={loading1 || bleConnected1}
            >
              <Text style={styles.scanText}>
                {bleConnected1 ? i18n.t('setup.connected') : loading1 ? i18n.t('setup.scanning') : i18n.t('setup.scan')}
              </Text>
            </TouchableOpacity>
            {!bleConnected1 && !loading1 && devices1.length === 0 && (
              <Text style={styles.noDeviceText}>{i18n.t('setup.noDeviceFound')}</Text>
            )}
            {!bleConnected1 && devices1.length > 0 && (
              <View style={styles.deviceList}>
                {devices1.map((device, index) => (
                  <TouchableOpacity
                    key={`player1-${device.id}-${index}`}
                    style={styles.deviceItem}
                    onPress={() => connectToDevice1(device)}
                  >
                    <Text style={styles.deviceName}>{device.name || 'Casque'}</Text>
                    <Text style={styles.deviceId}>{device.id}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {loading1 && <ActivityIndicator size="small" color="#007acc" style={{ marginTop: 10 }} />}
          </View>

          {/* Bluetooth Joueur 2 (si mode multi) */}
          {mode === 'multi' && (
            <View style={styles.block}>
              <Text style={styles.label}>{i18n.t('setup.bluetoothDevicePlayer2')}</Text>
              <TouchableOpacity
                style={styles.scanButton}
                onPress={scanForDevices2}
                disabled={loading2 || bleConnected2}
              >
                <Text style={styles.scanText}>
                  {bleConnected2 ? i18n.t('setup.connected') : loading2 ? i18n.t('setup.scanning') : i18n.t('setup.scan')}
                </Text>
              </TouchableOpacity>
              {!bleConnected2 && !loading2 && devices2.length === 0 && (
                <Text style={styles.noDeviceText}>{i18n.t('setup.noDeviceFound')}</Text>
              )}
              {!bleConnected2 && devices2.length > 0 && (
                <View style={styles.deviceList}>
                  {devices2.map((device, index) => (
                    <TouchableOpacity
                      key={`player2-${device.id}-${index}`}
                      style={styles.deviceItem}
                      onPress={() => connectToDevice2(device)}
                    >
                      <Text style={styles.deviceName}>{device.name || 'Casque'}</Text>
                      <Text style={styles.deviceId}>{device.id}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {loading2 && <ActivityIndicator size="small" color="#007acc" style={{ marginTop: 10 }} />}
            </View>
          )}

          {/* Bouton Commencer */}
          <TouchableOpacity
            style={[styles.startButton, !canStart && { opacity: 0.5 }]}
            onPress={handleStart}
            disabled={!canStart}
          >
            <Text style={styles.startText}>{i18n.t('setup.startGame')}</Text>
          </TouchableOpacity>

          {/* Bouton DEV : Commencer sans BLE */}
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: '#ffb347', marginTop: 8 }]}
            onPress={async () => {
              if (!player1.trim() || (mode === 'multi' && !player2.trim())) {
                Alert.alert(i18n.t('common.error'), i18n.t('setup.errorPlayerNames'));
                return;
              }
              if (!selectedWeapon || (mode === 'multi' && !selectedWeapon2)) {
                Alert.alert(i18n.t('common.error'), i18n.t('setup.errorWeaponSelection'));
                return;
              }

              if (connectedDevice1) {
                await sendWeaponSetting(selectedWeapon, connectedDevice1);
              }

              if (mode === 'multi' && connectedDevice2) {
                await sendWeaponSetting(selectedWeapon2, connectedDevice2);
              }

              console.log('Navigation DEV vers Main avec:', {
                joueur1: player1,
                joueur2: player2,
                arme1: selectedWeapon,
                arme2: selectedWeapon2,
                device1: null,
                device2: null,
                mode,
              });

              navigation.navigate('Main', {
                screen: 'Game',
                params: {
                  joueur1: player1,
                  joueur2: player2,
                  arme1: selectedWeapon,
                  arme2: selectedWeapon2,
                  device1: null,
                  device2: null,
                  mode,
                }
              });
            }}
            disabled={mode === 'solo'
              ? !player1.trim() || !selectedWeapon
              : !player1.trim() || !player2.trim() || !selectedWeapon || !selectedWeapon2
            }
          >
            <Text style={[styles.startText, { color: '#111' }]}>{i18n.t('setup.devStartGame')}</Text>
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
