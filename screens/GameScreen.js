import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import i18n from '../languages/i18n';

import { useMode } from '../context/ModeContext';
import { useTouch } from '../context/TouchContext';
import { useLightColor } from '../context/LightColorContext';
import { useSettings } from '../context/SettingsContext';
import { useHistory } from '../context/HistoryContext';
import { useBluetooth } from '../context/BluetoothContext';

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

export default function GameScreen({ route, navigation }) {
  const { mode } = useMode();
  const { soundEnabled, selectedSound } = useSettings();
  const { addMatch } = useHistory();
  const { connectedDevice } = useBluetooth();

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
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(true);

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

  // console.log('GameScreen - Paramètres reçus:', route?.params);

  const gameMode = routeMode || mode;
  const isSolo = gameMode === 'solo';
  const playerName = isSolo ? (joueur1 || i18n.t('game.player')) : (joueur1 || i18n.t('game.player1'));
  const player2Name = joueur2 || i18n.t('game.player2');
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

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      // Countdown terminé, commencer la partie
      setTimeout(() => {
        setShowCountdown(false);
        setGameStarted(true);
        setRunning(true);
      }, 1000); // Petite pause après "GO!"
    }
  }, [countdown, showCountdown]);

  const handleBackPress = () => {
    // Si aucune partie n'est en cours, revenir directement
    if (!gameStarted || showCountdown) {
      navigation.navigate('Bienvenue');
      return;
    }

    // Si une partie est en cours, afficher la modale
    setRunning(false);
    setStopped(true);
    Alert.alert(
      i18n.t('game.leavingGame'),
      i18n.t('game.saveGameQuestion'),
      [
        {
          text: i18n.t('game.cancel'),
          style: 'cancel',
          onPress: () => {
            setStopped(false);
            setRunning(true);
          },
        },
        {
          text: i18n.t('game.yes'),
          style: 'default',
          onPress: () => {
            saveMatch();
            navigation.navigate('Bienvenue');
          },
        },
        {
          text: i18n.t('game.no'),
          style: 'destructive',
          onPress: () => {
            navigation.navigate('Bienvenue');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Animation background */}
      <LottieView
        source={require('../assets/animation/backgroundWelcomeScreen.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={styles.backgroundAnimation}
      />

      {/* Bouton retour */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Indicateur de connexion Bluetooth */}
      <View style={styles.connectionIndicator}>
        <Ionicons 
          name={connectedDevice ? "bluetooth" : "bluetooth-outline"} 
          size={20} 
          color={connectedDevice ? "#00c9a7" : "#ff6b6b"} 
        />
        {connectedDevice && <View style={styles.connectedDot} />}
      </View>

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
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: '#00c9a7', opacity: showCountdown ? 0.5 : 1 }]}
                onPress={() => {
                  if (!showCountdown) {
                    setGameStarted(true);
                    setRunning(true);
                    setStopped(false);
                  }
                }}
                disabled={showCountdown}
              >
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
                    i18n.t('game.gameFinished'),
                    i18n.t('game.saveGameQuestion'),
                    [
                      {
                        text: i18n.t('game.cancel'),
                        style: 'cancel',
                        onPress: () => {
                          setStopped(false);
                          setRunning(true);
                        },
                      },
                      {
                        text: i18n.t('game.yes'),
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
                      {
                        text: i18n.t('game.no'),
                        style: 'destructive',
                        onPress: () => {
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
              </>
            )}
          </View>
        </View>

        {/* Pause overlay */}
        {gameStarted && !running && (
          <View style={styles.pauseMenuOverlay}>
            <View style={styles.pauseMenuContainer}>
              <Text style={styles.pauseTitle}>{i18n.t('game.gamePaused')}</Text>
              
              {/* Bouton Reprendre */}
              <TouchableOpacity 
                style={styles.pauseButton} 
                onPress={() => setRunning(true)}
              >
                <Ionicons name="play" size={24} color="#fff" style={styles.pauseButtonIcon} />
                <Text style={styles.pauseButtonText}>{i18n.t('game.resume')}</Text>
              </TouchableOpacity>

              {/* Bouton Réglages */}
              <TouchableOpacity 
                style={[styles.pauseButton, styles.pauseButtonSecondary]} 
                onPress={() => {
                  // Naviguer vers les réglages tout en gardant la partie en pause
                  navigation.navigate('SettingsFromWelcome');
                }}
              >
                <Ionicons name="settings" size={24} color="#0a3871" style={styles.pauseButtonIcon} />
                <Text style={[styles.pauseButtonText, styles.pauseButtonTextSecondary]}>{i18n.t('settings.title')}</Text>
              </TouchableOpacity>

              {/* Bouton Quitter */}
              <TouchableOpacity 
                style={[styles.pauseButton, styles.pauseButtonDanger]} 
                onPress={() => {
                  Alert.alert(
                    i18n.t('game.leavingGame'),
                    i18n.t('game.saveGameQuestion'),
                    [
                      {
                        text: i18n.t('game.cancel'),
                        style: 'cancel',
                        onPress: () => {
                          // Rester en pause
                        },
                      },
                      {
                        text: i18n.t('game.yes'),
                        style: 'default',
                        onPress: () => {
                          saveMatch();
                          navigation.navigate('Bienvenue');
                        },
                      },
                      {
                        text: i18n.t('game.no'),
                        style: 'destructive',
                        onPress: () => {
                          navigation.navigate('Bienvenue');
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                }}
              >
                <Ionicons name="exit" size={24} color="#fff" style={styles.pauseButtonIcon} />
                <Text style={styles.pauseButtonText}>{i18n.t('game.quit')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {showCountdown && (
          <View style={styles.countdownOverlay}>
            <Text style={styles.countdownText}>
              {countdown > 0 ? countdown : i18n.t('game.go')}
            </Text>
          </View>
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
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    height: 100,
    marginBottom: 8,
  },
  backgroundAnimation: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: 'black',
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
  pauseMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pauseMenuContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  pauseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a3871',
    marginBottom: 30,
    textAlign: 'center',
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00c9a7',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  pauseButtonSecondary: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#0a3871',
  },
  pauseButtonDanger: {
    backgroundColor: '#e74c3c',
    marginBottom: 0, // Dernier bouton
  },
  pauseButtonIcon: {
    marginRight: 10,
  },
  pauseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  pauseButtonTextSecondary: {
    color: '#0a3871',
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
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  countdownText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  countdownSubtext: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.8,
  },
  connectionIndicator: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00c9a7',
    marginLeft: 4,
  },
});