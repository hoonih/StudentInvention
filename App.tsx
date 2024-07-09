/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useState, useEffect, useRef } from "react";
import type {PropsWithChildren} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  PermissionsAndroid,
} from "react-native";

import { BleManager, Device, Characteristic, BleError } from "react-native-ble-plx";

import styled, { useTheme } from 'styled-components/native';


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

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const STEP_DATA_CHAR_UUID = "beefcafe-36e1-4688-b7f5-00000000000b";

const bleManager = new BleManager();

function App(): React.JSX.Element {
  
  const [deviceID, setDeviceID] = useState<string | null>(null);
  const [stepCount, setStepCount] = useState<number>(0);
  const [stepDataChar, setStepDataChar] = useState<Characteristic | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Searching...");

  const progress = (stepCount / 1000) * 100;

  const deviceRef = useRef<Device | null>(null);

  const searchAndConnectToDevice = (): void => {
    bleManager.startDeviceScan(null, null, (error: BleError | null, device: Device | null) => {
      if (error) {
        console.error(error);
        setConnectionStatus("Error searching for devices");
        return;
      }
      if (device && device.name === "Childdev") {
        bleManager.stopDeviceScan();
        setConnectionStatus("Connecting...");
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
        setConnectionStatus("Connected");
        deviceRef.current = device;
        return device.discoverAllServicesAndCharacteristics();
      })
      .then((device) => {
        return device.services();
      })
      .then((services) => {
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
      })
      .catch((error) => {
        console.log(error);
        setConnectionStatus("Error in Connection");
      });
  };

  useEffect(() => {
    const subscription = bleManager.onDeviceDisconnected(
      deviceID,
      (error, device) => {
        if (error) {
          console.log("Disconnected with error:", error);
        }
        setConnectionStatus("Disconnected");
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
    <SafeAreaView>
      <Back>
      <Text>{connectionStatus}</Text>

      </Back>
    </SafeAreaView>
  );
}


export default App;

const Back = styled.View`
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`