import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, PermissionsAndroid, Platform, Alert, ActivityIndicator, Button, Dimensions } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import LottieView from 'lottie-react-native';

const SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
const CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef1';

const BluetoothScreen = () => {
  const [devices, setDevices] = useState([]);
  const [manager] = useState(new BleManager());
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [loading, setLoading] = useState(false);

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

      if (device?.name && !devices.find(d => d.id === device.id)) {
        console.log('Trouvé:', device.name, device.id);
        setDevices((prev) => [...prev, device]);
      }
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
      console.log('Connecté à : ', connected.name);

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
          }
        }
      );

      Alert.alert('Connecté', `Périphérique: ${connected.name}`);
    } catch (err) {
      console.error('Erreur connexion:', err);
      Alert.alert('Erreur', 'Impossible de se connecter au ');
    }
  };

  return (
    // <SafeAreaView style={styles.safeContainer}>
    <View style={styles.container}>
      {/* Animation background */}
      <LottieView
        source={require('../assets/animation/backgroundWelcomeScreen.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={styles.backgroundAnimation}
      />

      <Text style={styles.title}>Périphériques Bluetooth à proximité</Text>

      {loading && <ActivityIndicator size="large" color="#007acc" style={{ marginVertical: 20 }} />}

      {!loading && devices.length === 0 && (
        <Text style={styles.noDeviceText}>Aucun périphérique trouvé</Text>
      )}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.device} onPress={() => connectToDevice(item)}>
            <Text style={styles.deviceName}>{item.name}</Text>
            <Text style={styles.deviceId}>{item.id}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.buttonContainer}>
        <Button title="Rescanner" onPress={scanForDevices} color="#007acc" />
      </View>
    </View>
    // </SafeAreaView>
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
