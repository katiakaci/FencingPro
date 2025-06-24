module.exports = {
    expo: {
        name: "Fencing",
        slug: "Fencing",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/logo.png",
        userInterfaceStyle: "light",
        splash: {
            image: "./assets/logo.png",
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
                foregroundImage: "./assets/logo.png",
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
        // androidNavigationBar: {
        //   visible: "immersive",
        //   barStyle: "light-content",
        //   backgroundColor: "#00c9a7"
        // },
        web: {
            favicon: "./assets/logo.png"
        },
        plugins: [
            [
                'expo-system-ui',
                {
                    androidNavigationBar: {
                        visible: 'immersive',
                        barStyle: 'light-content',
                        backgroundColor: '#00c9a7',
                    },
                },
            ],
            'react-native-ble-plx',
        ],
    }
};
