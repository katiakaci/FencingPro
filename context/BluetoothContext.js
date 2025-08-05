import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Buffer } from 'buffer';
import { BleManager } from 'react-native-ble-plx';

const SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
const TOUCH_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef1'; // Pour recevoir les touches
const COLOR_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef2'; // Pour envoyer les couleurs
const VIBRATION_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef3'; // Pour le moteur vibrant
const WEAPON_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef4'; // Pour le type d'arme

const BluetoothContext = createContext();

// convertir RGBA en hex
const rgbaToHex = (rgba) => {
    if (rgba.startsWith('#')) {
        return rgba; // Déjà en hex
    }

    if (rgba.startsWith('rgba')) {
        // Extraire val rgba(r, g, b, a)
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);

            // Convertir en hex
            const toHex = (n) => {
                const hex = n.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };

            return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
        }
    }

    return rgba; // Retourner tel quel si format inconnu
};

// convertir les noms de couleurs de base en hex
const getColorHex = (color) => {
    // console.log('color:', color, 'type:', typeof color);

    // Si c'est déjà un code hex
    if (color.startsWith('#')) {
        return color;
    }

    // Si format rgba, le convertir
    if (color.startsWith('rgba') || color.startsWith('rgb')) {
        const hexColor = rgbaToHex(color);
        // console.log('rgba to hex:', color, '->', hexColor);
        return hexColor;
    }

    // Conversion pour les 5 couleurs principales
    const basicColors = {
        'lime': '#00FF00',
        'red': '#FF0000',
        'blue': '#0000FF',
        'yellow': '#FFFF00',
        'purple': '#800080',
    };

    return basicColors[color] || color;
};

export const BluetoothProvider = ({ children }) => {
    const [manager] = useState(() => new BleManager());
    const [connectedDevice, setConnectedDevice] = useState(null);
    const colorTimeoutRef = useRef(null);
    const lastColorRef = useRef(null);

    const setDevice = (device) => setConnectedDevice(device);

    // Envoie la couleur au microcontrôleur avec debounce
    const sendColorSetting = useCallback(async (color) => {
        const hexColor = getColorHex(color);

        // Éviter l'envoi de la même couleur
        if (lastColorRef.current === hexColor) {
            return;
        }

        console.log('Envoi couleur BLE:', color, '->', hexColor);

        if (!connectedDevice) {
            console.log('!!!!Pas de device connecté pour couleur, Aurait envoyé:', hexColor);
            return;
        }

        // Debounce : attendre 300ms avant d'envoyer
        if (colorTimeoutRef.current) {
            clearTimeout(colorTimeoutRef.current);
        }

        colorTimeoutRef.current = setTimeout(async () => {
            lastColorRef.current = hexColor;

            try {
                await connectedDevice.writeCharacteristicWithResponseForService(
                    SERVICE_UUID,
                    COLOR_CHARACTERISTIC_UUID,
                    Buffer.from(hexColor).toString('base64')
                );
                console.log('COULEUR ENVOYEEEEE ✅✅✅');
            } catch (e) {
                console.log('COULEUR PAS ENVOYEE❌', e);
                // Reset en cas d'erreur pour permettre un nouvel essai
                lastColorRef.current = null;
            }
        }, 300); // Attendre 300ms
    }, [connectedDevice]);

    // Envoie la commande vibration au microcontrôleur
    const sendVibrationSetting = useCallback(async (enabled) => {
        if (!connectedDevice) return;

        const value = enabled ? '1' : '0';
        console.log('Envoi vibration BLE:', value);
        try {
            await connectedDevice.writeCharacteristicWithResponseForService(
                SERVICE_UUID,
                VIBRATION_CHARACTERISTIC_UUID,
                Buffer.from(value).toString('base64')
            );
            console.log('VIBRATION ENVOYEEEEE ✅✅✅');
        } catch (e) {
            console.log('❌ Erreur envoi vibration:', e);
        }
    }, [connectedDevice]);

    // Envoie le type d'arme au microcontrôleur
    const sendWeaponSetting = useCallback(async (weaponType, device = null) => {
        const targetDevice = device || connectedDevice;
        if (!targetDevice) {
            console.log('!!!!Pas de device connecté pour arme, Aurait envoyé:', weaponType);
            return;
        }

        const weaponCode = weaponType === 'Fleuret' ? '2' : '3'; // 2 = Fleuret, 3 = Sabre

        console.log('Envoi arme BLE:', weaponType, '->', weaponCode);

        try {
            await targetDevice.writeCharacteristicWithResponseForService(
                SERVICE_UUID,
                WEAPON_CHARACTERISTIC_UUID,
                Buffer.from(weaponCode).toString('base64')
            );
            console.log('ARME ENVOYEEEEE ✅✅✅');
        } catch (e) {
            console.log('❌ Erreur envoi arme:', e);
        }
    }, [connectedDevice]);

    return (
        <BluetoothContext.Provider value={{
            manager,
            connectedDevice,
            setDevice,
            sendVibrationSetting,
            sendColorSetting,
            sendWeaponSetting,
        }}>
            {children}
        </BluetoothContext.Provider>
    );
};

export const useBluetooth = () => useContext(BluetoothContext);