import React from 'react';
import { View, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { FsButton } from './CustomComponents';

const PreviewModal = (props) => {
  const {
    visible,
    toggleModal,
    children,
    containerStyle = {},
    backButtonColor = 'white',
    ...rest
  } = props;

  return (
    <Modal visible={visible} animationType="fade" {...rest}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: 'black',
          paddingTop: 40,
          ...containerStyle,
        }}
      >
        <FsButton
          style={{
            alignSelf: 'flex-start',
            minWidth: 5,
            borderColor: 'transparent',
          }}
          onPress={() => toggleModal && toggleModal()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={40}
            color={backButtonColor}
          />
        </FsButton>
        {children}
      </View>
    </Modal>
  );
};

export default PreviewModal;
