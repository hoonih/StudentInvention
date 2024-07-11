import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const Success: React.FC = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/animation/success.json')}
        style={styles.animation}
        autoPlay
        loop
      />
    </View>
  );
};

export default Success;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  animation: {
    width: '100%',
    aspectRatio: 1, // Adjust this based on your animation's aspect ratio
  },
});
