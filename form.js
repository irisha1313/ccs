import React from 'react';
import _ from 'lodash';
import { View, Platform } from 'react-native';
import moment from 'moment';
import { Fonts, Colors } from '../../constants';
import { getRoleName, formatPhoneNumber } from '../../sharedMethods/users';
import { FsInputWithLabel, FsText } from '../../components/CustomComponents';
import styles from './styles';

const EditProfileForm = ({
  userData: { name, email, role_id, created_at, phone },
  onChange,
}) => {
  return (
    <View style={styles.EditProfileForm}>
      <FsText
        style={[
          {
            marginTop: 24,
            alignItems: 'center',
            textAlign: 'center',
            fontSize: Fonts.size.xbig,
            color: Colors.primaryLight,
          },
        ]}
      >
        General Information
      </FsText>
      <FsText style={[{ marginLeft: 5, marginTop: 24 }]}>
        Email: {email}
      </FsText>
      <FsText style={[{ marginLeft: 5, marginTop: 24 }]}>
        Role: {getRoleName(role_id)}
      </FsText>
      <FsText style={[{ marginLeft: 5, marginTop: 24 }]}>
        Member Since:{' '}
        {created_at && moment(created_at).format('DD/MM/YYYY')}
      </FsText>
      <FsInputWithLabel
        name="name"
        label="NAME"
        selectTextOnFocus={true}
        returnKeyType="next"
        autoCorrect={true}
        autoCapitalize="words"
        containerStyle={[{ marginTop: 24 }]}
        onChangeText={(text) => {
          onChange('name', text);
        }}
        value={name}
        placeholder={name ? name : ''}
      />
      <FsInputWithLabel
        name="phone"
        label="PHONE"
        keyboardType={Platform.select({
          ios: 'numbers-and-punctuation',
          android: 'default',
        })}
        selectTextOnFocus={true}
        returnKeyType="next"
        containerStyle={[{ marginTop: 24 }]}
        onChangeText={(text) => {
          onChange('phone', formatPhoneNumber(text));
        }}
        value={phone}
        placeholder={phone ? phone : '() ___-____'}
      />
    </View>
  );
};

export default EditProfileForm;
