import React, { createContext, useContext, useState, useCallback } from 'react';
import { Buffer } from 'buffer';
import { BleManager } from 'react-native-ble-plx';

const SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
const CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef1';

const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
    const [manager] = useState(() => new BleManager());
    const [connectedDevice, setConnectedDevice] = useState(null);

    const setDevice = (device) => setConnectedDevice(device);

    // Envoie la commande vibration au microcontrôleur
    const sendVibrationSetting = useCallback(async (enabled) => {
        if (!connectedDevice) return;

        const value = enabled ? '1' : '0';
        console.log('Envoi vibration BLE:', value);
        try {
            await connectedDevice.writeCharacteristicWithResponseForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID,
                Buffer.from(value).toString('base64')
            );
        } catch (e) {
            console.log('Erreur envoi vibration:', e);
        }
    }, [connectedDevice]);

    return (
        <BluetoothContext.Provider value={{
            manager,
            connectedDevice,
            setDevice,
            sendVibrationSetting,
        }}>
            {children}
        </BluetoothContext.Provider>
    );
};

export const useBluetooth = () => useContext(BluetoothContext);