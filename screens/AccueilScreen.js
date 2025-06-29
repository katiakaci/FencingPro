import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMode } from '../context/ModeContext';
import { useTouch } from '../context/TouchContext';
import { useLightColor } from '../context/LightColorContext';

export default function AccueilScreen({ route }) {
  const { mode } = useMode();
  const isSolo = mode === 'solo';
  const { touchDetected } = useTouch();
  const { lightColor } = useLightColor();
  const [time, setTime] = useState(30 * 60);
  const [running, setRunning] = useState(true);
  const [bobScore, setBobScore] = useState(0);
  const [julieScore, setJulieScore] = useState(0);
  const { joueur1 } = route.params || {};

  const barColorLeft = touchDetected ? 'lime' : '#ddd';
  const barColorRight = touchDetected ? '#ddd' : 'white';

  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let timer = null;
    if (running) {
      timer = setInterval(() => setTime((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    }
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (touchDetected) {
      setFlash(true);
      setTimeout(() => setFlash(false), 300); // 300ms de flash
      if (isSolo) {
        setBobScore(prev => prev + 1);
      } else {
        setBobScore(prev => prev + 1); // ou selon l'arme reliée ?
      }
    }
  }, [touchDetected]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `00:${m}:${s}`;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="auto" />

        {/* Scores */}
        <View style={styles.nameContainer}>
          <View style={[styles.nameBox, { backgroundColor: '#ddd', borderRightWidth: isSolo ? 0 : 1 }]}>
            <Text style={styles.nameText}>{joueur1 || 'Bob'}</Text>  {/* changer nom!!! */}
            <Text style={styles.scoreText}>{bobScore}</Text>
          </View>
          {!isSolo && (
            <View style={[styles.nameBox, { backgroundColor: '#ddd' }]}>
              <Text style={styles.nameText}>Julie</Text>
              <Text style={styles.scoreText}>{julieScore}</Text>
            </View>
          )}
        </View>

        {/* Barres */}
        <View style={styles.barContainer}>
          <View
            style={[
              styles.half,
              {
                backgroundColor: flash ? lightColor : barColorLeft, // Utilise la couleur choisie
              },
            ]}
          />
          {!isSolo && (
            <View
              style={[
                styles.half,
                {
                  backgroundColor: barColorRight,
                },
              ]}
            />
          )}
        </View>

        {/* Chrono et boutons */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(time)}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => setRunning(!running)}>
              <Ionicons name={running ? 'pause' : 'play'} size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setRunning(false); setTime(0); }}>
              <Ionicons name="stop" size={28} color="tomato" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTime(30 * 60)}>
              <Ionicons name="refresh" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 0 // TODO enlever la marge blanche en haut apres
  },
  nameContainer: {
    flexDirection: 'row',
    height: 80,
  },
  nameBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 24,
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  half: {
    flex: 1,
  },
  timerContainer: {
    height: 110,
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 30,
    color: '#fff',
    // letterSpacing:2
    //  fontVariant: ['tabular-nums'],
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier', // Fixe pour Android
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 30,
  },
});