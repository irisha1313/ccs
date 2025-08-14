import React from 'react';
import { TextInput } from 'react-native';
import defaultTo from 'lodash/defaultTo';

import { FsText } from '../../components/CustomComponents';
import { Colors, Fonts, Styles } from '../../constants';

const MaxNoteLength = 5000;

const NewNote = ({ placeholder, value, onChange }) => {
  return (
    <>
      <TextInput
        placeholderTextColor={Colors.textSecondary}
        placeholder={placeholder}
        autoCorrect={true}
        autoCapitalize="sentences"
        multiline={true}
        maxLength={MaxNoteLength}
        style={{
          ...Styles.general.fsInputStyle,
          ...Styles.general.fsInputStyleMultiline,
          fontSize: Fonts.size.small,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: Colors.divider,
          borderBottomLeftRadius: Styles.constant.BorderRadius,
          borderBottomRightRadius: Styles.constant.BorderRadius,
          height: 200,
          marginTop: 25,
          backgroundColor: Colors.CardBackground,
        }}
        value={value}
        onChangeText={(newValue) => {
          if (onChange) {
            onChange(newValue);
          }
        }}
      />

      <FsText
        style={{
          color: Colors.textSecondary,
          fontSize: Fonts.size.small,
          textAlign: 'right',
          marginTop: 4,
        }}
      >
        {MaxNoteLength - defaultTo(value, '').length} characters left
      </FsText>
    </>
  );
};

export default NewNote;
