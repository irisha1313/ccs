import React from 'react';
import { View } from 'native-base';
import { Switch } from 'react-native';

import { Fonts, Colors } from '../constants';
import { FsText } from './CustomComponents';

export default ({
  title,
  hint,
  currentValue,
  onChange,
  offValue = false,
  disabled = false,
  style = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: Colors.borderLightGrey,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
}) => {
  return (
    <View style={{ flexDirection: 'column', paddingBottom: 15 }}>
      <View style={style}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FsText
            style={{
              padding: 0,
              paddingLeft: 10,
              color: 'black',
            }}
          >
            {title}{' '}
          </FsText>
        </View>
        <Switch
          disabled={disabled}
          style={{
            marginRight: 14,
          }}
          trackColor={{ false: Colors.grey, true: Colors.secondarySharpDark }}
          thumbColor="white"
          ios_backgroundColor={
            currentValue !== offValue ? Colors.secondarySharpDark : Colors.grey
          }
          onValueChange={onChange}
          value={Boolean(currentValue !== offValue)}
        />
      </View>
      {hint && (
        <FsText
          style={{
            padding: 0,
            paddingHorizontal: 10,
            paddingBottom: 5,
            fontSize: Fonts.size.small,
            color: Colors.secondaryTextGrey,
          }}
        >
          {hint}
        </FsText>
      )}
    </View>
  );
};
