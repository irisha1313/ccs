import React from 'react';

import { FsInputWithLabel } from '../../../../components/CustomComponents';

const InputWithLabel = ({ name, label, value, onChange, ...props }) => (
  <FsInputWithLabel
    name={name}
    label={label}
    selectTextOnFocus={true}
    containerStyle={{ marginTop: 24 }}
    returnKeyType="next"
    autoCapitalize="words"
    onChangeText={(newValue) => onChange(name, newValue)}
    value={value}
    placeholder={value || ''}
    {...props}
  />
);

export default InputWithLabel;
