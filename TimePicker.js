import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import moment from 'moment-timezone';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Appearance } from 'react-native';

import { FsText, FsButton } from './CustomComponents';
import { Fonts, Colors } from '../constants';

export default ({
  title,
  value,
  onChange,
  onPress,
  labelRight,
  containerStyle,
  labelStyle,
  labelRightStyle,
  buttonLabelStyle,
}) => {
  const [show, setShow] = useState(false);
  const theme = Appearance.getColorScheme();

  return (
    <View style={containerStyle}>
      <FsButton
        style={{
          alignSelf: 'flex-start',
          minWidth: 5,
          borderColor: 'transparent',
          ...buttonLabelStyle,
        }}
        onPress={async () => {
          if (onPress) {
            let shouldContinue = await onPress();
            if (shouldContinue) {
              setShow(!show);
            }
          } else {
            setShow(!show);
          }
        }}
      >
        <FsText
          style={{
            fontSize: Fonts.size.xxsmall,
            color: Colors.textSecondary,
            ...labelStyle,
          }}
        >
          {!value ? '' : moment(value, 'HH:mm:ss').format('HH:mm')}
        </FsText>
      </FsButton>
      <DateTimePickerModal
        modalPropsIOS={{
          supportedOrientations: ['portrait', 'landscape'],
        }}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        isDarkModeEnabled={theme === 'dark'}
        isVisible={show}
        mode="time"
        headerTextIOS="Please select a time"
        date={
          !value
            ? new Date()
            : new Date(
                new Date().setHours(
                  moment(value, 'HH:mm:ss').format('HH'),
                  moment(value, 'HH:mm:ss').format('mm')
                )
              )
        }
        onConfirm={(time) => {
          setShow(false);
          onChange(time);
        }}
        onCancel={() => setShow(false)}
      />
      <View
        style={[
          { marginTop: 2 },
          { paddingHorizontal: 8 },
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        ]}
      >
        <FsText
          style={[
            { fontSize: Fonts.size.xxsmall },
            { color: Colors.textSecondary },
          ]}
        >
          {title}
        </FsText>
        {typeof labelRight === 'string' ? (
          <FsText
            style={[
              { fontSize: Fonts.size.xxsmall },
              { color: Colors.textSecondary },
              labelRightStyle,
            ]}
          >
            {labelRight}
          </FsText>
        ) : (
          labelRight
        )}
      </View>
    </View>
  );
};
