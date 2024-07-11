import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native";
import { useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import ItemWithTextSvg from '../components/ItemWithSvg';

import { BleManager, Device, Characteristic, BleError } from "react-native-ble-plx";

type RouteParams = {
  device: Device;
};

const textMapping: { [key: string]: string } = {
  "1": "오늘은",
  "2": "날씨가",
  "3": "좋아",
};

const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const STEP_DATA_CHAR_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";


const MainScreen: React.FC = () => {
  const route = useRoute();
  const { device } = route.params as { device: Device };
  const { bleManager } = route.params as { bleManager: BleManager  };

  const [textData, setTextData] = useState<string[]>([]);
  const [deviceID, setDeviceID] = useState<string | null>(null);
  const [stepDataChar, setStepDataChar] = useState<Characteristic | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Searching...");
  const [loading, setloading] = useState<Boolean>(true);
  const [receiveData, setReceiveData] = useState<string>("");

  const deviceRef = useRef<Device | null>(null);



  useEffect(() => {
    connectToDevice(device);
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
            setReceiveData(String(rawStepData));
            const parsedData = rawStepData.split(" ").map((num) => textMapping[num]);
            console.log({parsedData})
            setTextData(parsedData);
          }
        });
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      <Back>
        <Container>
          <Title>
            문장 재활
          </Title>
        </Container>
        <List>
          {textData.map((text, index) => (
            <ItemContainer key={index}>
              <ItemWithTextSvg text={text} />
            </ItemContainer>
          ))}
        </List>
      </Back>
    </SafeAreaView>
  );
};

const Back = styled.View`
  display: flex;
  height: 100%;
  width: 100%;
`;

const List = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ItemContainer = styled.View`
  width: 50%;
  align-items: center;
  margin-bottom: 16px;
`;

const Container = styled.View`
  display: flex;
  flex-direction: row;
  padding: 0 16px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const Title = styled.Text`
  color: #000714;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 140% */
  letter-spacing: 0.01px;
  margin: 16px 0px;
`;

export default MainScreen;
