import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, PermissionsAndroid, Platform, Alert, ActivityIndicator, Button, Dimensions } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64';

import { useTouch } from '../context/TouchContext';

const SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
const CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef1';

const BluetoothScreen = () => {
  const [devices, setDevices] = useState([]);
  const [manager] = useState(new BleManager());
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setTouchDetected } = useTouch();

  useEffect(() => {
    if (Platform.OS === 'android') requestPermissions();
    scanForDevices();

    return () => {
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  const requestPermissions = async () => {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);
  };

  const scanForDevices = () => {
    setDevices([]);
    setLoading(true);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        setLoading(false);
        return;
      }

      // Vérifie si cest la bonne adresse mac, a changer!!!!!!!!!!!!!!!!!!!!
      if (device?.id === 'C8:D5:62:67:18:D9' && !devices.find(d => d.id === device.id)) {
        console.log('Microcontrôleur trouvé:', device.name || '(sans nom)', device.id);
        setDevices([device]);
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setLoading(false);
    }, 10000);
  };

  const connectToDevice = async (device) => {
    try {
      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);
      console.log('Connecté à : ', connected.name || '(aucun nom)');

      connected.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('Erreur notif:', error);
            return;
          }
          if (characteristic?.value) {
            const decoded = base64.decode(characteristic.value);
            const boolValue = decoded.charCodeAt(0) !== 0;
            console.log('Notification reçue:', boolValue);
            if (boolValue) {
              setTouchDetected(true);
              setTimeout(() => setTouchDetected(false), 500); // Réinitialise après 0.5s
            }
          }
        }
      );

      Alert.alert('Connecté', `Périphérique: ${connected.name || '(aucun nom)'}`);
    } catch (err) {
      console.error('Erreur connexion:', err);
      Alert.alert('Erreur', 'Impossible de se connecter au ');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Périphériques Bluetooth à proximité</Text>

      {loading && <ActivityIndicator size="large" color="#007acc" style={{ marginVertical: 20 }} />}

      {!loading && devices.length === 0 && (
        <Text style={styles.noDeviceText}>Aucun périphérique trouvé</Text>
      )}

      <FlatList
        data={devices}
        keyExtractor={(item, index) => `${item.id || 'inconnu'}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.device} onPress={() => connectToDevice(item)}>
            <Text style={styles.deviceName}>Nom : {item.name || 'riennnnnnnnnnnnnn'}</Text>
            <Text style={styles.deviceId}>Adresse mac : {item.id}</Text>
            <Text style={styles.deviceId}>puissance signal (RSSI) : {item.rssi ?? 'noooo'}</Text>
            {/* plus cest proche de 0, plus le signal est bon */}
            {/* <Text style={styles.deviceId}>Nom local?? : {item.localName || 'Nooooo'}</Text> */}
            {/* <Text style={styles.deviceId}>Services : {item.serviceUUIDs?.join(', ') || 'Nononononono'}</Text> */}
            {/* <Text style={styles.deviceId}>Manufacturer data : {item.manufacturerData || 'Nooooooooooon'}</Text> */}
          </TouchableOpacity>
        )}
      />

      <View style={styles.buttonContainer}>
        <Button title="Rescanner" onPress={scanForDevices} color="#007acc" />
      </View>
    </View>
  );
};

export default BluetoothScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noDeviceText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
    marginVertical: 20,
  },
  device: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
  },
  backgroundAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height + 10,
    zIndex: -1,
  },
});
