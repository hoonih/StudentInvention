import React from 'react';
import { Text } from "react-native";
import { useRoute } from '@react-navigation/native';
import { Device } from "react-native-ble-plx";
import styled from 'styled-components/native';

const BluetoothSuccessScreen = () => {
    const route = useRoute();
    const { device } = route.params as { device: Device };
  
  return (
    <Back>
      <Text>연결에 성공하였습니다!</Text>
      <Text>Device ID: {device.id}</Text>
      <Text>Device Name: {device.name || "Unknown"}</Text>
    </Back>
  );
};

export default BluetoothSuccessScreen;

const Back = styled.View`
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
