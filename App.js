import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import BienvenueScreen from './screens/BienvenueScreen';
import SettingsScreen from './screens/SettingsScreen';
import NameScreen from './screens/NameScreen';
import AccueilScreen from './screens/AccueilScreen';
import HistoriqueScreen from './screens/HistoriqueScreen';
import BluetoothScreen from './screens/BluetoothScreen';

import { LightColorProvider } from './context/LightColorContext';
import { ModeProvider } from './context/ModeContext';
import { TouchProvider } from './context/TouchContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MainDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Accueil" component={AccueilScreen} />
      <Drawer.Screen name="Joueur 1" component={NameScreen} />
      <Drawer.Screen name="Bluetooth" component={BluetoothScreen} />
      <Drawer.Screen name="Historique" component={HistoriqueScreen} />
      <Drawer.Screen name="Réglages" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {

  useEffect(() => {
    SystemUI.setBackgroundColorAsync('#00C2CB');
  }, []);

  return (
    <ModeProvider>
      <TouchProvider>
        <LightColorProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Bienvenue" component={BienvenueScreen} />
              <Stack.Screen name="Main" component={MainDrawer} />
            </Stack.Navigator>
          </NavigationContainer>
        </LightColorProvider>
      </TouchProvider>
    </ModeProvider>
  );
}
