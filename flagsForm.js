import React from 'react';
import { View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';

import FlagCreationEntry from '../../components/FlagCreationEntry';
import FlagsPlusAndMinus from '../../components/FlagsPlusAndMinus';
import { tracksByOrgId } from './staticData';

const FlagsForm = (props) => {
  const {
    isDerail,
    isFormB,
    isSwitchLocks,
    isActive,
    flags,
    onPressMinusFlag,
    onPressPlusFlag,
    onFlagUpdate,
  } = props;
  let { currentOrgId } = useSelector((state) => ({
    currentOrgId: state.organizations.currentOrganization.settings.id,
  }));

  const isUP = currentOrgId === 6 || currentOrgId === 8 || currentOrgId === 9;

  const tracksForOrg = tracksByOrgId[isUP ? 6 : currentOrgId] || [];

  return (
    <View>
      <FlagsPlusAndMinus
        title={isDerail ? 'Derails:' : isFormB ? 'Flags:' : 'Switches:'}
        num_flags={flags.length}
        onPressMinusFlag={onPressMinusFlag}
        onPressPlusFlag={onPressPlusFlag}
        containerStyle={[{ marginTop: 40 }]}
        isActive={isActive}
      />

      <FlatList
        data={flags}
        listKey={moment().valueOf().toString()}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={(rowData) => (
          <FlagCreationEntry
            tracksForOrg={tracksForOrg}
            isActive={isActive}
            {...{ isDerail, isFormB, isSwitchLocks }}
            flag={rowData.item}
            onChangeText={(attribute, newValue) => {
              onFlagUpdate(attribute, newValue, rowData.index);
            }}
            onPressFlag={() => {
              // switch locks doesn't have alternate options
              if (!isSwitchLocks) {
                let newFlagColor;
                if (isDerail && rowData.item.type === 'rh') {
                  newFlagColor = 'lh';
                } else {
                  switch (rowData.item.type) {
                    case 'red':
                      newFlagColor = 'yellow-red';
                      break;
                    case 'yellow-red':
                      newFlagColor = 'red';
                      break;
                    case 'lh':
                      newFlagColor = 'rh';
                      break;
                    case 'rh':
                      newFlagColor = 'lh';
                      break;
                  }
                }
                const newColor = newFlagColor;
                onFlagUpdate('type', newColor, rowData.index);
              }
            }}
          />
        )}
        contentContainerStyle={[{ marginTop: 24 }, { paddingHorizontal: 32 }]}
        ItemSeparatorComponent={() => <View style={{ marginTop: 16 }}></View>}
      />
    </View>
  );
};

export default FlagsForm;
