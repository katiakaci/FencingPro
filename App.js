import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './languages/i18n';

import BienvenueScreen from './screens/BienvenueScreen';
import SettingsScreen from './screens/SettingsScreen';
import GameScreen from './screens/GameScreen';
import HistoriqueScreen from './screens/HistoriqueScreen';
import StatistiquesScreen from './screens/StatistiquesScreen';
import SetupScreen from './screens/SetupScreen';

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
        headerShown: false,
        headerTransparent: true,
        headerTitle: '',
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen name="Game" component={GameScreen} />
      <Drawer.Screen name="Historique" component={HistoriqueScreen} />
      <Drawer.Screen name="Statistiques" component={StatistiquesScreen} />
      <Drawer.Screen name="Réglages" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync('#00C2CB');

    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('userLanguage');
        if (savedLanguage) {
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.log('Erreur chargement langue:', error);
      }
    };

    loadSavedLanguage();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <ModeProvider>
        <TouchProvider>
          <LightColorProvider>
            <SettingsProvider>
              <HistoryProvider>
                <BluetoothProvider>
                  <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="Bienvenue" component={BienvenueScreen} />
                      <Stack.Screen
                        name="SettingsFromWelcome"
                        component={SettingsScreen}
                        options={{
                          headerShown: true,
                          title: i18n.t('settings.title'),
                          headerStyle: { backgroundColor: '#00C2CB' },
                          headerTintColor: '#fff',
                        }}
                      />
                      <Stack.Screen
                        name="HistoriqueFromWelcome"
                        component={HistoriqueScreen}
                        options={{
                          headerShown: true,
                          title: i18n.t('history.title'),
                          headerStyle: { backgroundColor: '#00C2CB' },
                          headerTintColor: '#fff',
                        }}
                      />
                      <Stack.Screen
                        name="StatsFromWelcome"
                        component={StatistiquesScreen}
                        options={{
                          headerShown: true,
                          title: i18n.t('stats.title'),
                          headerStyle: { backgroundColor: '#00C2CB' },
                          headerTintColor: '#fff',
                        }}
                      />
                      <Stack.Screen name="Main" component={MainDrawer} />
                    </Stack.Navigator>
                  </NavigationContainer>
                </BluetoothProvider>
              </HistoryProvider>
            </SettingsProvider>
          </LightColorProvider>
        </TouchProvider>
      </ModeProvider>
    </GestureHandlerRootView>
  );
}
