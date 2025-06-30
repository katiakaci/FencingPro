import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

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
        <TouchableOpacity onPress={() => navigation.replace('Main')}>
          <LottieView
            source={require('../assets/animation/playButton.json')}
            autoPlay
            loop
            style={styles.playAnimation}
          />
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
});
