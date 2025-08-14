import React, { useState, useEffect, useContext } from 'react';
import { Content, View, Fab, Button } from 'native-base';
import { TextInput } from 'react-native';
import moment from 'moment-timezone';
import {
  FontAwesome,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import { Colors, Styles, Fonts } from '../constants';
import {
  FsButtonActionIcon,
  ScrollableScreen,
  FsText,
  FsAlert,
} from './CustomComponents';

const TextInputWithLabelAndDescription = ({
  title = '',
  value = '',
  onChange,
  placeHolder = '',
  inputStyle = {},
  descriptionStyle = {},
  titleStyle = {
    paddingTop: 10,
    marginBottom: 5,
    alignItems: 'center',
    textAlign: 'left',
    fontSize: Fonts.size.small,
    color: Colors.textGrey,
    fontWeight: 'bold',
  },
  containerStyle = {
    marginHorizontal: 8,
    marginVertical: 10,
    borderTopLeftRadius: Styles.constant.BorderRadius,
    borderTopRightRadius: Styles.constant.BorderRadius,
    borderBottomLeftRadius: Styles.constant.BorderRadius,
    borderBottomRightRadius: Styles.constant.BorderRadius,
  },
  maxDescriptionLength = 255,
  ...rest
}) => (
  <View style={containerStyle}>
    <FsText style={titleStyle}>{title}</FsText>
    <TextInput
      placeholderTextColor={Colors.textSecondary}
      placeholder={placeHolder}
      maxLength={maxDescriptionLength}
      style={inputStyle}
      value={value}
      onChangeText={onChange}
      {...rest}
    />

    <FsText style={descriptionStyle}>
      {maxDescriptionLength - value.length} characters left
    </FsText>
  </View>
);

export default TextInputWithLabelAndDescription;
