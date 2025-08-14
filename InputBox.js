import React from 'react';
import { Item, Input, Text, Icon } from 'native-base';
import omit from 'lodash/omit';

import { Colors, Styles } from '../constants';
import { getFontIcon } from '../utils/common';

import appStyles from '../theme/appStyles';

const InputBox = ({
  input,
  meta: { touched, error },
  disabled = false,
  placeholder = '',
  placeholderTextColor = Colors.black,
  keyboardType = 'default',
  autoCapitalize = 'none',
  maxLength = 100,
  numberOfLines = 1,
  spellCheck = false,
  autoCorrect = false,
  secureTextEntry = false,
  style = { fontFamily: Styles.constant.FontFamily },
  labelType = 'regular',
  icon = '',
  iconStyle = {},
}) => {
  let hasError = false;
  let iconImg = getFontIcon(icon, iconStyle) || <Icon />;
  if (touched && error) {
    hasError = true;
  }
  if (disabled) {
  } else {
    return (
      <Item style={appStyles.itemInput} error={hasError}>
        {iconImg}
        <Input
          {...omit(input, 'value')}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[appStyles.textbox, style]}
          maxLength={maxLength}
          numberOfLines={numberOfLines}
          spellCheck={spellCheck}
          autoCorrect={autoCorrect}
          secureTextEntry={secureTextEntry}
        />
        {hasError ? (
          <Text style={appStyles.inputError}>{error}</Text>
        ) : (
          <Text />
        )}
      </Item>
    );
  }
};
export default InputBox;
