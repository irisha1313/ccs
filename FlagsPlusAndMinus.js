import React, { Component } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Fonts, Icons } from '../constants';
import { FsText, FsButton } from './CustomComponents';

const FlagsPlusAndMinus = (props) => {
  const {
    containerStyle,
    onPressMinusFlag,
    title,
    num_flags,
    onPressPlusFlag,
    isActive,
  } = props;
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        containerStyle,
      ]}
    >
      {isActive && (
        <FsButton
          onPress={onPressMinusFlag}
          style={[
            { borderWidth: 1, borderColor: Colors.divider },
            { borderRadius: 24 },
            { height: 48 },
          ]}
        >
          <MaterialCommunityIcons
            name="minus"
            size={Icons.size.normal}
            color={Colors.accent}
          />
        </FsButton>
      )}

      <FsText
        style={{ fontWeight: 'bold', fontSize: Fonts.size.big, marginLeft: 16 }}
      >
        {title}
      </FsText>
      <FsText
        style={{
          fontWeight: 'bold',
          fontSize: Fonts.size.big,
          marginLeft: 8,
          marginRight: 16,
        }}
      >
        {num_flags}
      </FsText>
      {isActive && (
        <FsButton
          onPress={onPressPlusFlag}
          style={[
            { borderWidth: 1, borderColor: Colors.divider },
            { borderRadius: 24 },
          ]}
        >
          <MaterialCommunityIcons
            name="plus"
            size={Icons.size.normal}
            color={Colors.accent}
          />
        </FsButton>
      )}
    </View>
  );
};

export default FlagsPlusAndMinus;
