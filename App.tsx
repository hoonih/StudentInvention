import React, { useState, useEffect, useRef } from "react";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchLoadingScreen from "./src/screens/SearchLoadingScreen";
import BluetoothSuccessScreen from "./src/screens/BluetoothSuccessScreen";
import { BleManager, Device, Characteristic, BleError } from "react-native-ble-plx";
import AppNavigator from "./src/navigation/RootNavigatior";

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
      <AppNavigator/>
  );
}


export default App;