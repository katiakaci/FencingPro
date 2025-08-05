import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

import { useMode } from '../context/ModeContext';
import { useTouch } from '../context/TouchContext';
import { useLightColor } from '../context/LightColorContext';
import { useSettings } from '../context/SettingsContext';
import { useHistory } from '../context/HistoryContext';

const SOUND_FILES = {
  'alert_touch.mp3': require('../assets/sound/alert_touch.mp3'),
  'alert_touch2.mp3': require('../assets/sound/alert_touch2.mp3'),
  'alert_touch3.mp3': require('../assets/sound/alert_touch3.mp3'),
  'alert_touch4.mp3': require('../assets/sound/alert_touch4.mp3'),
  'alert_touch5.mp3': require('../assets/sound/alert_touch5.mp3'),
  'alert_touch6.mp3': require('../assets/sound/alert_touch6.mp3'),
  'alert_touch7.mp3': require('../assets/sound/alert_touch7.mp3'),
  'alert_touch8.mp3': require('../assets/sound/alert_touch8.mp3'),
  'alert_touch9.mp3': require('../assets/sound/alert_touch9.mp3'),
};

export default function AccueilScreen({ route, navigation }) {
  const { mode } = useMode();
  const { soundEnabled, selectedSound } = useSettings();
  const { addMatch } = useHistory();

  // Mettre le jeu en pause quand on quitte la page ou quand on ouvre le menu hamburger
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setRunning(false);
      };
    }, [])
  );
  const { touchDetected } = useTouch();
  const { lightColor } = useLightColor();
  const [time, setTime] = useState(30 * 60);
  const [running, setRunning] = useState(true);
  const [bobScore, setBobScore] = useState(0);
  const [julieScore, setJulieScore] = useState(0);
  const [chrono, setChrono] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  // Récupérer les paramètres de navigation
  const {
    joueur1,
    joueur2,
    arme1,
    arme2,
    device1,
    device2,
    mode: routeMode
  } = route?.params || {};

  console.log('AccueilScreen - Paramètres reçus:', route?.params);

  const gameMode = routeMode || mode;
  const isSolo = gameMode === 'solo';
  const playerName = isSolo ? (joueur1 || 'Joueur') : (joueur1 || 'Joueur 1');
  const player2Name = joueur2 || 'Joueur 2';
  const weaponType = arme1 || 'Épée';

  const barColorLeft = (touchDetected && gameStarted && running) ? lightColor : 'white';
  const barColorRight = touchDetected ? 'white' : 'white';

  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let chronoTimer = null;
    if (running && gameStarted) {
      chronoTimer = setInterval(() => {
        setChrono(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(chronoTimer);
  }, [running, gameStarted]);

  useEffect(() => {
    // On ignore les touches si la partie n'est pas en cours
    if (!gameStarted || !running) return;

    if (touchDetected) {
      playTouchSound();
      setFlash(true);

      setTimeout(() => setFlash(false), 300);
      if (isSolo) {
        setBobScore(prev => prev + 1);
      } else {
        setBobScore(prev => prev + 1);
      }
    }
  }, [touchDetected, gameStarted, running]);

  const saveMatch = async () => {
    try {
      const matchData = {
        id: Date.now().toString(),
        date: new Date().toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        players: isSolo ? playerName : `${playerName} vs ${player2Name}`,
        weapon: weaponType,
        score: isSolo ? `${bobScore}` : `${bobScore}–${julieScore}`,
        duration: formatChrono(chrono),
      };

      console.log('Match à sauvegarder:', matchData);
      await addMatch(matchData);
    } catch (error) {
      console.log('Erreur lors de la sauvegarde:', error);
    }
  };

  useEffect(() => {
    if (stopped) {
      setRunning(false);
    }
  }, [stopped]);

  const formatChrono = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const playTouchSound = async () => {
    if (!soundEnabled) return;

    try {
      const soundAsset = SOUND_FILES[selectedSound];
      if (!soundAsset) {
        console.log('Fichier son non trouvé:', selectedSound);
        return;
      }

      const { sound } = await Audio.Sound.createAsync(soundAsset);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.didJustFinish) sound.unloadAsync();
      });
    } catch (e) {
      console.log('Erreur son:', e);
    }
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
            <Text style={styles.nameText}>{playerName}</Text>
            <View style={styles.scoreCircle}><Text style={styles.scoreText}>{bobScore}</Text></View>
          </View>
          {!isSolo && (
            <View style={styles.nameBox}>
              <Text style={styles.nameText}>{player2Name}</Text>
              <View style={styles.scoreCircle}><Text style={styles.scoreText}>{julieScore}</Text></View>
            </View>
          )}
        </View>

        {/* Affichage de l'arme */}
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Text style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            backgroundColor: 'rgba(0,0,0,0.18)',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 4
          }}>
            {weaponType}
          </Text>
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
          <View style={styles.timerBox}><Text style={styles.timerText}>{formatChrono(chrono)}</Text></View>
          <View style={styles.buttonRow}>
            {!gameStarted ? (
              <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#00c9a7' }]} onPress={() => {
                setGameStarted(true);
                setRunning(true);
                setStopped(false);
              }}>
                <Ionicons name="play" size={28} color="#fff" />
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: running ? '#fff' : '#f7b731' }]}
                  onPress={() => setRunning(r => !r)}
                >
                  <Ionicons name="pause" size={28} color={running ? '#0a3871' : '#fff'} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconButton, { backgroundColor: 'tomato' }]} onPress={() => {
                  setRunning(false);
                  setStopped(true);
                  Alert.alert(
                    'Partie terminée',
                    'Voulez-vous enregistrer cette partie dans l’historique ?',
                    [
                      {
                        text: 'Annuler',
                        style: 'cancel',
                        onPress: () => {
                          setStopped(false);
                          setRunning(true);
                        },
                      },
                      {
                        text: 'Non',
                        style: 'destructive',
                        onPress: () => {
                          setStopped(false);
                          setBobScore(0);
                          setJulieScore(0);
                          setChrono(0);
                          setGameStarted(false);
                        },
                      },
                      {
                        text: 'Oui',
                        style: 'default',
                        onPress: () => {
                          saveMatch();
                          setStopped(false);
                          setBobScore(0);
                          setJulieScore(0);
                          setChrono(0);
                          setGameStarted(false);
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                }}>
                  <Ionicons name="stop" size={28} color="#fff" />
                </TouchableOpacity>
                {/* Replay button only visible when game is started */}
                <TouchableOpacity style={styles.iconButton} onPress={() => {
                  setChrono(0);
                  setRunning(false);
                  setGameStarted(false);
                  setBobScore(0);
                  setJulieScore(0);
                }}>
                  <Ionicons name="refresh" size={28} color="#0a3871" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        {/* Pause overlay */}
        {gameStarted && !running && (
          <TouchableOpacity style={styles.pauseOverlay} activeOpacity={0.8} onPress={() => setRunning(true)}>
            <Ionicons name="pause" size={120} color="#fff" style={{ opacity: 0.9 }} />
          </TouchableOpacity>
        )}
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
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});