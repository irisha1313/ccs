import React from 'react';
import { Callout } from 'react-native-maps';
import { Colors, Fonts, Styles } from '../constants';
import { FsText, FsButton } from './CustomComponents';

const HeaderMessageCallout = (props) => {
  return (
    <Callout
      style={{
        alignSelf: 'center',
        zIndex: 10000,
        width: '100%',
        top: 32,
        ...props.calloutStyle,
      }}
      onPress={props.onPress}
    >
      <FsButton
        style={{
          backgroundColor: Colors.white,
          marginHorizontal: 32,
          borderRadius: 10,
          padding: 0,
          paddingLeft: 0,
          paddingRight: 12,
          paddingTop: 8,
          paddingBottom: 16,
          ...props.containerStyle,
        }}
        onPress={props.onPress}
      >
        <FsText
          style={{
            textAlign: 'right',
            color: Colors.textSecondary,
            fontSize: Fonts.size.xsmall,
          }}
        >
          [close x]
        </FsText>
        {props.children}
      </FsButton>
    </Callout>
  );
};

export default HeaderMessageCallout;
