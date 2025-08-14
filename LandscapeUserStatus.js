import React from 'react';
import { View } from 'native-base';

import UserStatusBoard from '../../../../components/SafeClear/UserStatusBoard';

const LandscapeUserStatus = () => {
  return (
    <View style={{ paddingTop: 0 }}>
      <UserStatusBoard />
    </View>
  );
};

export default LandscapeUserStatus;
