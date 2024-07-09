import React, { useState, useEffect, useRef } from "react";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchLoadingScreen from "../screens/SearchLoadingScreen";
import BluetoothSuccessScreen from "../screens/BluetoothSuccessScreen";
import { createStackNavigator } from '@react-navigation/stack';
import { BleManager, Device, Characteristic, BleError } from "react-native-ble-plx";

type RootStackParamList = {
  SearchLoadingScreen: undefined;
  BluetoothSuccessScreen: { device: Device };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="SearchLoadingScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SearchLoadingScreen" component={SearchLoadingScreen} />
        <Stack.Screen name="BluetoothSuccessScreen" 
            component={BluetoothSuccessScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
