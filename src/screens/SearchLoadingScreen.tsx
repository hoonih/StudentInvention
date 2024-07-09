
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

const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const STEP_DATA_CHAR_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

const bleManager = new BleManager();

const SearchLoadingScreen = () => {
    const navigation = useNavigation();

  const [deviceID, setDeviceID] = useState<string | null>(null);
  const [stepCount, setStepCount] = useState<number>(0);
  const [stepDataChar, setStepDataChar] = useState<Characteristic | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Searching...");
  const [loading, setloading] = useState<Boolean>(true);

  const progress = (stepCount / 1000) * 100;

  const deviceRef = useRef<Device | null>(null);

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
        connectToDevice(device);
      }
    });
  };

  useEffect(() => {
    searchAndConnectToDevice();
  }, []);

  const connectToDevice = (device: Device): Promise<void> => {
    return device
      .connect()
      .then((device) => {
        setDeviceID(device.id);
        setloading(false);
        setConnectionStatus("연결 되었습니다.");
        deviceRef.current = device;
        return device.discoverAllServicesAndCharacteristics();
      })
      .then((device) => {
        return device.services();
      })
      .then((services) => {
        console.log(services.find((service) => service.uuid));
        const service = services.find((service) => service.uuid === SERVICE_UUID);
        if (!service) {
          throw new Error("Service not found");
        }
        return service.characteristics();
      })
      .then((characteristics) => {
        const stepDataCharacteristic = characteristics.find(
          (char) => char.uuid === STEP_DATA_CHAR_UUID
        );
        console.log(characteristics.find((char) => char.uuid));
        if (!stepDataCharacteristic) {
          throw new Error("Step Data Characteristic not found");
        }
        setStepDataChar(stepDataCharacteristic);
        stepDataCharacteristic.monitor((error, char) => {
          if (error) {
            console.error(error);
            return;
          }
          if (char?.value) {
            const rawStepData = atob(char.value);
            console.log("Received step data:", rawStepData);
            setStepCount(Number(rawStepData));
          }
        });
        navigation.navigate('BluetoothSuccessScreen', { device });
      })
      .catch((error) => {
        console.log(error);
        setConnectionStatus("연결 실패");
      });
      
  };

  useEffect(() => {
    const subscription = bleManager.onDeviceDisconnected(
      deviceID,
      (error, device) => {
        if (error) {
          console.log("Disconnected with error:", error);
        }
        setConnectionStatus("연결이 해제되었습니다.");
        console.log("Disconnected device");
        setStepCount(0); // Reset the step count
        if (deviceRef.current) {
          setConnectionStatus("Reconnecting...");
          connectToDevice(deviceRef.current)
            .then(() => setConnectionStatus("Connected"))
            .catch((error) => {
              console.log("Reconnection failed: ", error);
              setConnectionStatus("Reconnection failed");
            });
        }
      }
    );
    return () => subscription.remove();
  }, [deviceID]);


  return (
      <Back>
        {loading && <Loading />}
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
