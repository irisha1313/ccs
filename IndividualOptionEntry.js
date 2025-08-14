import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'native-base';

import { Colors, Icons } from '../constants';
import { FsText, FsButton } from './CustomComponents';
import Badge from './Badge';

const IndividualOptionEntry = ({
  value,
  selected,
  prepend,
  badge,
  onPress,
}) => {
  return (
    <View
      style={{
        flex: 1,
        paddingLeft: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: Colors.borderLightGrey,
        backgroundColor: selected ? Colors.lightGreyBackground : 'white',
      }}
    >
      <FsButton
        style={{ padding: 0 }}
        onPress={() => {
          if (!selected) {
            onPress();
          }
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {prepend}
          <FsText style={{ flex: 1, color: Colors.black }}>{value}</FsText>

          {badge ? <Badge value={badge} status="primary" /> : null}

          <MaterialCommunityIcons
            name={selected ? 'check' : 'chevron-right'}
            size={Icons.size.xbig}
            color={Colors.primary}
            style={{ paddingRight: 5 }}
          />
        </View>
      </FsButton>
    </View>
  );
};

export default IndividualOptionEntry;
