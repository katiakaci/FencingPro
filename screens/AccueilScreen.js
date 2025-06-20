import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useMode } from '../context/ModeContext';

export default function AccueilScreen({ route }) {
  const { mode } = useMode();
  const isSolo = mode === 'solo';

  const [time, setTime] = useState(30 * 60);
  const [running, setRunning] = useState(true);
  const [bobScore, setBobScore] = useState(0);
  const [julieScore, setJulieScore] = useState(0);
  const { joueur1 } = route.params || {};

  useEffect(() => {
    let timer = null;
    if (running) {
      timer = setInterval(() => setTime((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    }
    return () => clearInterval(timer);
  }, [running]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `00:${m}:${s}`;
  };

  return (
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
        <View style={[styles.half, { backgroundColor: 'lime' }]} />
        {!isSolo && <View style={[styles.half, { backgroundColor: 'white' }]} />}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: 150,
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 40,
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 30,
  },
});