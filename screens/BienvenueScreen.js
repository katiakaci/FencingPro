import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BienvenueScreen({ navigation }) {
  return (
    <View style={styles.welcomeContainer}>
      <LottieView
        source={require('../assets/animation/backgroundWelcomeScreen.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={styles.backgroundAnimation}
      />

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>FencingPro</Text>
        <TouchableOpacity onPress={() => navigation.replace('Setup')}>
          <LottieView
            source={require('../assets/animation/playButton.json')}
            autoPlay
            loop
            style={styles.playAnimation}
          />
        </TouchableOpacity>
      </View>
      {/* Boutons settings et stats en bas */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomIconBtn}
          onPress={() => navigation.navigate('Main', { screen: 'Historique' })}
          accessibilityLabel="Statistiques"
        >
          <Ionicons name="stats-chart" size={15} color="#0a3871" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomIconBtn}
          onPress={() => navigation.navigate('Main', { screen: 'Réglages' })}
          accessibilityLabel="Réglages"
        >
          <Ionicons name="settings" size={15} color="#0a3871" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
  },
  backgroundAnimation: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: 'black',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: '700',
    color: '#fff',
    fontStyle: 'italic',
    marginBottom: 40,
  },
  playAnimation: {
    width: 300,
    height: 300,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 20,
  },
  bottomIconBtn: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 10,
    marginHorizontal: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    justifyContent: 'center',
  },
});
