import React from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown-v2';
import moment from 'moment-timezone';

import TimePicker from './TimePicker';
import { timezonesDropdownArray } from '../containers/CreateFormBScreen/staticData';
import { Colors, Styles, Fonts } from '../constants';

const TimeAndTimezonePicker = ({
  title,
  value,
  timezone,
  valueName,
  onChange,
}) => (
  <TimePicker
    title={title}
    labelStyle={{
      fontFamily: 'RobotoCondensed-Regular',
      fontSize: Fonts.size.normal,
      color: 'black',
    }}
    value={value}
    onChange={(time) => {
      const newTimeValue = moment(time)
        .seconds(0)
        .milliseconds(0)
        .format('HH:mm');
      onChange(valueName, newTimeValue);
    }}
    labelRight={
      <View style={{ minWidth: 180 }}>
        <Dropdown
          labelFontSize={0}
          dropdownOffset={{ top: 5, left: 5 }}
          fontSize={Fonts.size.small}
          style={{
            fontFamily: Styles.constant.FontFamily,
            color: Colors.black,
            marginTop: 0,
            backgroundColor: 'transparent',
          }}
          containerStyle={{
            paddingHorizontal: 5,
            width: '100%',
            alignSelf: 'center',
          }}
          value={timezone}
          fontSize={Fonts.size.small}
          data={timezonesDropdownArray}
          onChangeText={(selectedTimezone) =>
            onChange('timezone', selectedTimezone)
          }
        />
      </View>
    }
    labelRightStyle={{
      fontFamily: 'RobotoCondensed-Regular',
      fontSize: Fonts.size.normal,
      color: 'black',
    }}
    containerStyle={{ marginTop: 24 }}
    buttonLabelStyle={{
      width: '100%',
      padding: 0,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderColor: '#BDBDBD',
    }}
  />
);

export default TimeAndTimezonePicker;
