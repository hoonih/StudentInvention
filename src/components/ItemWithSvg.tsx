import React from 'react';
import { Svg, Rect, Text, Path } from 'react-native-svg';


interface ItemWithTextSvgProps {
    text: string;
  }

const ItemWithTextSvg: React.FC<ItemWithTextSvgProps> = ({ text }) => (
    <Svg width="167" height="167" viewBox="0 0 167 167" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Rect width="167" height="167" rx="24" fill="black"/>
    <Rect x="22" y="48" width="123" height="71" rx="12" fill="white"/>
    <Path d="M156 80C156 78.3431 157.343 77 159 77H167V89H159C157.343 89 156 87.6569 156 86V80Z" fill="#333333" fill-opacity="0.2"/>
    <Path d="M0 77H8C9.65685 77 11 78.3431 11 80V86C11 87.6569 9.65685 89 8 89H0V77Z" fill="#333333" fill-opacity="0.2"/>
    <Text
      x="50%"
      y="50%"
      textAnchor="middle"
      alignmentBaseline="middle"
      fontSize="20"
      fontWeight="700"
      fill="#000"
    >
        {text}
    </Text>
    </Svg>
    
);

export default ItemWithTextSvg;
