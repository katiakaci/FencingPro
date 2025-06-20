import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HistoriqueScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.screenText}>Historique</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenText: {
    fontSize: 28,
  },
});
