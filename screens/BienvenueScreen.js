import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

export default function BienvenueScreen({ navigation }) {
  return (
    // <SafeAreaView style={styles.safeContainer}>
      <View style={styles.welcomeContainer}>
        {/* Animation backgorund */}
        <LottieView
          source={require('../assets/animation/backgroundWelcomeScreen.json')}
          autoPlay
          loop
          resizeMode="cover"
          style={styles.backgroundAnimation}
        />

        {/* Titre + bouton centré */}
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
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
  },
  backgroundAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height + 10,
    zIndex: -1,
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
