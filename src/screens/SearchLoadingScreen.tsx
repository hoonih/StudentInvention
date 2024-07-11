
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from '@react-navigation/native';
import type {PropsWithChildren} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  PermissionsAndroid,
} from "react-native";

import { BleManager, Device, Characteristic, BleError } from "react-native-ble-plx";

import styled, { useTheme } from 'styled-components/native';

import Loading from "../../src/components/loading";
import RootStackParamList from '../navigation/RootNavigatior'; // 네비게이션 설정 파일의 경로

// Android Bluetooth Permission
async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: "Location permission for bluetooth scanning",
        message:
          "Grant location permission to allow the app to scan for Bluetooth devices",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Location permission for bluetooth scanning granted");
    } else {
      console.log("Location permission for bluetooth scanning denied");
    }
  } catch (err) {
    console.warn(err);
  }
}


requestLocationPermission();
const bleManager = new BleManager();

const SearchLoadingScreen = () => {
    const navigation = useNavigation();

  const [deviceID, setDeviceID] = useState<string | null>(null);
  const [stepDataChar, setStepDataChar] = useState<Characteristic | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Searching...");
  const [loading, setloading] = useState<Boolean>(true);
  const [receiveData, setReceiveData] = useState<string>("");


  const searchAndConnectToDevice = (): void => {
    bleManager.startDeviceScan(null, null, (error: BleError | null, device: Device | null) => {
      if (error) {
        console.error(error);
        setConnectionStatus("장치 찾기에 실패하였습니다.");
        return;
      }
      if (device && device.name === "ChildDev") {
        bleManager.stopDeviceScan();
        setConnectionStatus("연결중...");
        navigation.navigate('BluetoothSuccessScreen', { device, bleManager });
      }
    });
  };

  useEffect(() => {
    searchAndConnectToDevice();
  }, []);

  return (
      <Back>
        <Loading />
      <Text>{connectionStatus}</Text>

      </Back>
  );
}


export default SearchLoadingScreen;

const Back = styled.View`
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`
