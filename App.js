import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import BienvenueScreen from './screens/BienvenueScreen';
import SettingsScreen from './screens/SettingsScreen';
import NameScreen from './screens/NameScreen';
import GameScreen from './screens/GameScreen';
import HistoriqueScreen from './screens/HistoriqueScreen';
import BluetoothScreen from './screens/BluetoothScreen';
import SetupScreen from './screens/SetupScreen';
import StatistiquesScreen from './screens/StatistiquesScreen';

import { LightColorProvider } from './context/LightColorContext';
import { ModeProvider } from './context/ModeContext';
import { TouchProvider } from './context/TouchContext';
import { BluetoothProvider } from './context/BluetoothContext';
import { HistoryProvider } from './context/HistoryContext';
import { SettingsProvider } from './context/SettingsContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        // headerShown: false, // a décommenter apres
        headerTransparent: true,
        headerTitle: '',
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen name="Game" component={GameScreen} />
      <Drawer.Screen name="Joueur 1" component={NameScreen} />
      <Drawer.Screen name="Bluetooth" component={BluetoothScreen} />
      <Drawer.Screen name="Historique" component={HistoriqueScreen} />
      <Drawer.Screen name="Statistiques" component={StatistiquesScreen} />
      <Drawer.Screen name="Réglages" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync('#00C2CB');
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BluetoothProvider>
        <ModeProvider>
          <TouchProvider>
            <LightColorProvider>
              <SettingsProvider>
                <HistoryProvider>
                  <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="Bienvenue" component={BienvenueScreen} />
                      <Stack.Screen name="Setup" component={SetupScreen} />
                      <Stack.Screen
                        name="SettingsFromWelcome"
                        component={SettingsScreen}
                        options={{
                          headerShown: true,
                          title: 'Réglages',
                          headerStyle: { backgroundColor: '#00C2CB' },
                          headerTintColor: '#fff',
                        }}
                      />
                      <Stack.Screen
                        name="HistoriqueFromWelcome"
                        component={HistoriqueScreen}
                        options={{
                          headerShown: true,
                          title: 'Historique',
                          headerStyle: { backgroundColor: '#00C2CB' },
                          headerTintColor: '#fff',
                        }}
                      />
                      <Stack.Screen
                        name="StatsFromWelcome"
                        component={StatistiquesScreen}
                        options={{
                          headerShown: true,
                          title: 'Statistiques',
                          headerStyle: { backgroundColor: '#00C2CB' },
                          headerTintColor: '#fff',
                        }}
                      />
                      <Stack.Screen name="Main" component={MainDrawer} />
                    </Stack.Navigator>
                  </NavigationContainer>
                </HistoryProvider>
              </SettingsProvider>
            </LightColorProvider>
          </TouchProvider>
        </ModeProvider>
      </BluetoothProvider>
    </GestureHandlerRootView>
  );
}
