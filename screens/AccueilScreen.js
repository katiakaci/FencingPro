import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

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

  const barColorLeft = touchDetected ? 'lime' : 'white';
  const barColorRight = touchDetected ? 'white' : 'white';

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
      {/* Animation background */}
      <LottieView
        source={require('../assets/animation/backgroundWelcomeScreen.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
      />
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Scores */}
        <View style={styles.nameContainer}>
          <View style={[styles.nameBox, { borderRightWidth: isSolo ? 0 : 2 }]}> 
            <Text style={styles.nameText}>{joueur1 || 'Bob'}</Text>
            <View style={styles.scoreCircle}><Text style={styles.scoreText}>{bobScore}</Text></View>
          </View>
          {!isSolo && (
            <View style={styles.nameBox}>
              <Text style={styles.nameText}>Julie</Text>
              <View style={styles.scoreCircle}><Text style={styles.scoreText}>{julieScore}</Text></View>
            </View>
          )}
        </View>

        {/* Barres */}
        <View style={styles.barContainer}>
          <View
            style={[
              styles.half,
              {
                backgroundColor: flash ? lightColor : barColorLeft,
                borderRadius: 20,
                margin: 8,
                boxShadow: flash ? '0 0 20px #fff' : undefined,
              },
            ]}
          />
          {!isSolo && (
            <View
              style={[
                styles.half,
                {
                  backgroundColor: barColorRight,
                  borderRadius: 20,
                  margin: 8,
                },
              ]}
            />
          )}
        </View>

        {/* Chrono et boutons */}
        <View style={styles.timerContainer}>
          <View style={styles.timerBox}><Text style={styles.timerText}>{formatTime(time)}</Text></View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.iconButton} onPress={() => setRunning(!running)}>
              <Ionicons name={running ? 'pause' : 'play'} size={28} color="#0a3871" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: 'tomato' }]} onPress={() => { setRunning(false); setTime(0); }}>
              <Ionicons name="stop" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setTime(30 * 60)}>
              <Ionicons name="refresh" size={28} color="#0a3871" />
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
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    height: 100,
    marginBottom: 8,
  },
  nameBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    marginHorizontal: 4,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 1,
  },
  scoreCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a3871',
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  half: {
    flex: 1,
    minHeight: 200,
    borderWidth: 2,
    borderColor: '#0a3871',
    borderRadius: 20,
  },
  timerContainer: {
    height: 170,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    marginBottom: 8,
    paddingVertical: 24,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  timerBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  timerText: {
    fontSize: 36,
    color: '#0a3871',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
    letterSpacing: 2,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 30,
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});