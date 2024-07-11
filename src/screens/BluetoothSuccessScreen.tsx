import React from 'react';
import { SafeAreaView, Text } from "react-native";
import { useRoute } from '@react-navigation/native';
import { Device } from "react-native-ble-plx";
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { BleManager, Characteristic, BleError } from "react-native-ble-plx";

import Success from "../../src/components/success";

const BluetoothSuccessScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { device } = route.params as { device: Device };
    const { bleManager } = route.params as { bleManager: BleManager  };
    
  
  return (
    <SafeAreaView
        edges={['top']}
        style={{
        flex: 1,
        backgroundColor: "#FFF",
        }}>
        <Back>
            <Container>
                <Title>
                    기기 연결
                </Title>
            </Container>
            <Container2>
                <Container3>
                    <Success/>
                    <Boldtext>기기 페어링 완료!</Boldtext>
                </Container3>
            </Container2>
            <NextButton onPress={() => {
                navigation.navigate('MainScreen', { device, bleManager })
            }}
            >
                <ButtonText>시작하기</ButtonText>
            </NextButton>
        

        </Back>
    </SafeAreaView>
  );
};

export default BluetoothSuccessScreen;

const Back = styled.View`
    display: flex;
    height: 100%;
    justify-content: space-between;
    width: 100%;
`;

const Container = styled.View`
  display: flex;
  flex-direction: row;
  padding: 0 16px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const Container2 = styled.View`
    width: 100%;
    align-items: center;
    justify-content: center;
`
const Container3 = styled.View`
	display: flex;
    flex-direction: column;
    justify-content: center;
    width: 300px;
    align-items: center;
    height: 328px;
`
const NextButton = styled.TouchableOpacity`
    padding: 16px 20px;
    margin: 0 16px;
    align-items: center;
    border-radius: 12px;
    background-color: black;
`
const Title = styled.Text`
    color: #000714;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px; /* 140% */
    letter-spacing: 0.01px;
    margin: 16px 0px;
`
const Boldtext = styled.Text`
    color: #000714;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px; /* 140% */
    letter-spacing: 0.01px;
`
const ButtonText = styled.Text`
    color: #EBF1FF;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px; /* 162.5% */
    letter-spacing: 0.01px;
`