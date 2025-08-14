import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors, Icons } from '../constants';
import { FsText, FsButton } from './CustomComponents';
import _ from 'lodash';
import Badge from './Badge';

const EntryButton = (props) => {
  const [customIconSource, setCustomIconSource] = useState(undefined);

  useEffect(() => {
    setCustomIconSource(props.customIcon);
  }, []);

  return (
    <FsButton
      onPress={props.onPress && props.onPress}
      style={[
        { flexDirection: 'row', alignItems: 'center' },
        props.containerStyle,
      ]}
    >
      {customIconSource ? (
        <Image
          resizeMode="contain"
          style={{ minWidth: 24, minHeight: 24 }}
          source={{ uri: customIconSource }}
          onError={() => {
            setCustomIconSource(undefined);
          }}
        />
      ) : (
        <FontAwesome
          name={props.icon}
          size={Icons.size.normal}
          color={Colors.primary}
          style={{ minWidth: 24 }}
        />
      )}

      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <FsText>{props.text}</FsText>
      </View>
      {props.badge && props.badgeStatus ? (
        <Badge value={props.badge} status={props.badgeStatus} />
      ) : null}

      <MaterialCommunityIcons
        name={props.chevron ? props.chevron : 'chevron-right'}
        size={Icons.size.xbig}
        color={Colors.primary}
      />
    </FsButton>
  );
};

export default EntryButton;
