import React from 'react';
import LottieView from 'lottie-react-native';

const Loading: React.FC = () => {
  return (
    <LottieView
      source={require('../../assets/animation/loading.json')}
      style={{ width: '70%', height: '70%' }}
      autoPlay
      loop
    />
  );
};

export default Loading;
