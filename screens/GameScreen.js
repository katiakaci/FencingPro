import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';
import i18n from '../languages/i18n';

import { useMode } from '../context/ModeContext';
import { useTouch } from '../context/TouchContext';
import { useLightColor } from '../context/LightColorContext';
import { useSettings } from '../context/SettingsContext';
import { useHistory } from '../context/HistoryContext';
import { useBluetooth } from '../context/BluetoothContext';
import { useCountdown } from '../hooks/useCountdown';
import { GameTimer } from '../components/Game/Timer';
import { GameModal } from '../components/Game/Modal';
import { ScoreDisplay } from '../components/Game/ScoreDisplay';

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

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setRunning(false);
      };
    }, [])
  );

  const { touchDetected } = useTouch();
  const { lightColor } = useLightColor();
  const [running, setRunning] = useState(false);
  const [joueur2Score, setJoueur2Score] = useState(0);
  const [joueur1Score, setJoueur1Score] = useState(0);
  const [chrono, setChrono] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);

  const countdown = useCountdown(3, () => {
    setGameStarted(true);
    setRunning(true);
  });

  useEffect(() => {
    countdown.start();
  }, []);

  const {
    joueur1,
    joueur2,
    arme1,
    arme2,
    mode: routeMode
  } = route?.params || {};

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
        setJoueur2Score(prev => prev + 1);
      } else {
        setJoueur2Score(prev => prev + 1);
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
        score: isSolo ? `${joueur2Score}` : `${joueur2Score}–${joueur1Score}`,
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

  const handleBackPress = () => {
    if (!gameStarted || countdown.isActive) {
      navigation.navigate('Bienvenue');
      return;
    }

    setRunning(false);
    setStopped(true);
    setShowBackModal(true);
  };

  const handleStopGame = () => {
    setRunning(false);
    setStopped(true);
    setShowStopModal(true);
  };

  const resetGame = () => {
    setStopped(false);
    setJoueur2Score(0);
    setJoueur1Score(0);
    setChrono(0);
    setGameStarted(false);
    countdown.stop();
  };

  // Configuration des boutons pour la modale de pause
  const pauseModalButtons = [
    {
      icon: 'play',
      text: i18n.t('game.resume'),
      onPress: () => setRunning(true),
      textColor: '#fff'
    },
    {
      icon: 'settings',
      text: i18n.t('settings.title'),
      onPress: () => navigation.navigate('SettingsFromWelcome'),
      style: { backgroundColor: '#f8f9fa', borderWidth: 2, borderColor: '#0a3871' },
      textColor: '#0a3871'
    },
    {
      icon: 'exit',
      text: i18n.t('game.quit'),
      onPress: () => {
        setShowBackModal(true);
      },
      style: { backgroundColor: '#e74c3c', marginBottom: 0 },
      textColor: '#fff'
    }
  ];

  // Configuration des boutons pour la modale de retour
  const backModalButtons = [
    {
      icon: 'checkmark',
      text: i18n.t('game.yes'),
      onPress: () => {
        saveMatch();
        navigation.navigate('Bienvenue');
      },
      textColor: '#fff'
    },
    {
      icon: 'trash',
      text: i18n.t('game.no'),
      onPress: () => {
        navigation.navigate('Bienvenue');
      },
      style: { backgroundColor: '#e74c3c' },
      textColor: '#fff'
    },
    {
      icon: 'close',
      text: i18n.t('game.cancel'),
      onPress: () => {
        setShowBackModal(false);
        setStopped(false);
        setRunning(true);
      },
      style: { backgroundColor: '#f8f9fa', borderWidth: 2, borderColor: '#0a3871', marginBottom: 0 },
      textColor: '#0a3871'
    }
  ];

  const stopModalButtons = [
    {
      icon: 'checkmark',
      text: i18n.t('game.yes'),
      onPress: () => {
        saveMatch();
        setShowStopModal(false);
        resetGame();
      },
      textColor: '#fff'
    },
    {
      icon: 'trash',
      text: i18n.t('game.no'),
      onPress: () => {
        setShowStopModal(false);
        resetGame();
      },
      style: { backgroundColor: '#e74c3c' },
      textColor: '#fff'
    },
    {
      icon: 'close',
      text: i18n.t('game.cancel'),
      onPress: () => {
        setShowStopModal(false);
        setStopped(false);
        setRunning(true);
      },
      style: { backgroundColor: '#f8f9fa', borderWidth: 2, borderColor: '#0a3871', marginBottom: 0 },
      textColor: '#0a3871'
    }
  ];

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

        <ScoreDisplay
          playerName={playerName}
          player2Name={player2Name}
          joueur2Score={joueur2Score}
          joueur1Score={joueur1Score}
          isSolo={isSolo}
          weaponType={weaponType}
        />

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
        <GameTimer
          chrono={chrono}
          formatChrono={formatChrono}
          gameStarted={gameStarted}
          running={running}
          setRunning={setRunning}
          onStop={handleStopGame}
        />

        {/* Modale de pause */}
        <GameModal
          visible={gameStarted && !running && !showBackModal && !showStopModal}
          title={i18n.t('game.gamePaused')}
          buttons={pauseModalButtons}
        />

        {/* Modale de retour */}
        <GameModal
          visible={showBackModal}
          title={i18n.t('game.leavingGame')}
          subtitle={i18n.t('game.saveGameQuestion')}
          buttons={backModalButtons}
        />

        {/* Modale de stop */}
        <GameModal
          visible={showStopModal}
          title={i18n.t('game.gameFinished')}
          subtitle={i18n.t('game.saveGameQuestion')}
          buttons={stopModalButtons}
        />

        {countdown.isActive && (
          <View style={styles.countdownOverlay}>
            <Text style={styles.countdownText}>
              {countdown.count > 0 ? countdown.count : i18n.t('game.go')}
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
  backgroundAnimation: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: 'black',
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