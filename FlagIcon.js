import React from 'react';
import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors, Fonts, Icons, Styles } from '../constants';
import { FsText } from './CustomComponents';
import { getFlagIcon } from '../sharedMethods/flags';
import _ from 'lodash';

/**
 * @prop flag
 */
const FlagIcon = (props) => {
  const { isDerail, isFormB, isSwitchLocks, flagType } = props;

  return (
    <View
      style={[{ alignItems: 'center' }, { minWidth: 64 }, props.containerStyle]}
    >
      {isFormB || (isDerail && flagType === 'red') ? (
        <FontAwesome
          name={'flag'}
          size={Icons.size.normal}
          color={getFlagIcon(flagType)}
          style={{ minWidth: 24, textAlign: 'center' }}
        />
      ) : isSwitchLocks ? (
        <FontAwesome
          name={'lock'}
          size={Icons.size.normal}
          color={getFlagIcon(flagType)}
          style={{ minWidth: 24, textAlign: 'center' }}
        />
      ) : null}
      <FsText
        style={{
          fontSize:
            isDerail && flagType !== 'red'
              ? Fonts.size.big
              : Fonts.size.xxxxsmall,
          fontWeight: isDerail && flagType !== 'red' ? 'bold' : 'normal',
          color:
            isDerail && flagType !== 'red' ? getFlagIcon(flagType) : 'black',
          textAlign: 'center',
        }}
      >
        {_.toUpper(flagType).replace('-', '\n')}
      </FsText>
    </View>
  );
};

export default FlagIcon;
