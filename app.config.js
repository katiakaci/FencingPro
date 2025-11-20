module.exports = {
    expo: {
        name: "FencingPro",
        slug: "FencingPro",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/logoFencingPro.png",
        userInterfaceStyle: "light",
        splash: {
            image: "./assets/logoFencingPro.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true,
            infoPlist: {
                NSBluetoothAlwaysUsageDescription: "Cette app utilise le Bluetooth pour détecter les touches d'escrime."
            }
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/logoFencingPro.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdge: true,
            permissions: [
                "android.permission.BLUETOOTH",
                "android.permission.BLUETOOTH_ADMIN",
                "android.permission.BLUETOOTH_CONNECT",
                "android.permission.BLUETOOTH",
                "android.permission.BLUETOOTH_ADMIN",
                "android.permission.BLUETOOTH_CONNECT"
            ],
            package: "com.katiakaci.Fencing"
        },
        web: {
            favicon: "./assets/logoFencingPro.png"
        },
        plugins: [
            [
                'expo-system-ui',
                {
                    androidNavigationBar: {
                        visible: 'immersive',
                        barStyle: 'light-content',
                        backgroundColor: '#000000',
                    },
                },
            ],
            'react-native-ble-plx',
        ],
    }
};
