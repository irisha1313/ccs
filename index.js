import React, { useState } from 'react';
import { Platform } from 'react-native';
import { View } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { DraxProvider } from 'react-native-drax';
import Dialog from 'react-native-dialog';

import StatusColumn from './components/StatusColumn';
import { FsAlert } from '../../CustomComponents';
import { User } from '../../../constants/SafeClear';
import { manageUserStatusUpdate } from '../../../sharedMethods/SafeClear/users';
import { updateUserStatus } from '../../../actions/SafeClear/currentLog';

const UserStatusBoard = () => {
  const [exceptConfirmationTitle, setExceptConfirmationTitle] = useState('');
  const [exceptConfirmationMessage, setExceptConfirmationMessage] =
    useState('');
  const [confirmationPromptVisible, setConfirmationPromptVisible] =
    useState(false);
  const [exceptedUser, setExceptedUser] = useState(undefined);
  const [exceptedReason, setExceptedReason] = useState('');

  const dispatch = useDispatch();
  const { currentLog, updatingUserStatus } = useSelector((state) => ({
    currentLog: state.safeClear.currentLog.data,
    updatingUserStatus: state.safeClear.currentLog.updatingUserStatus,
  }));

  const statusMap = Object.values(User.statusMap);

  const data = statusMap.map(({ title, attributeName }, statusIndex) => {
    const statusRows =
      currentLog[attributeName]?.map((userStatusData) => ({
        ...userStatusData,
        statusAttributeName: attributeName,
      })) || [];

    return {
      id: statusIndex + 1,
      name: title,
      rows: statusRows,
    };
  });

  const emptyStateConfirmationData = () => {
    setExceptConfirmationTitle('');
    setExceptConfirmationMessage('');
    setExceptedUser(undefined);
    setExceptedReason('');
  };

  const toggleConfirmationPrompt = () =>
    setConfirmationPromptVisible(!confirmationPromptVisible);

  const confirmUserAction = async (user, selectedOption) => {
    if (
      selectedOption === User.statusMap.excepted.verb &&
      Platform.OS === 'android'
    ) {
      emptyStateConfirmationData();
      setExceptConfirmationTitle(`Except ${user.name}`);
      setExceptConfirmationMessage(`Why is ${user.name} being excepted?`);
      setExceptedUser(user);
      setConfirmationPromptVisible(true);
    } else {
      dispatch(
        manageUserStatusUpdate(
          selectedOption,
          user,
          currentLog.id,
          user.statusAttributeName
        )
      );
    }
  };

  const handleExceptionSubmission = async () => {
    if (!exceptedReason) {
      setConfirmationPromptVisible(false);
      await FsAlert.alertOk(
        'Invalid Reason',
        "Please make sure to fill this exception's reason."
      );
      setConfirmationPromptVisible(true);
    } else {
      dispatch(
        updateUserStatus({
          userId: exceptedUser.id,
          logId: currentLog.id,
          fromStatus: exceptedUser.statusAttributeName,
          toStatus: User.statusMap.excepted.attributeName,
          reason: exceptedReason,
        })
      );

      toggleConfirmationPrompt();
    }
  };

  return (
    <DraxProvider>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginHorizontal: 8,
        }}
      >
        {data.map((columnData) => (
          <StatusColumn
            key={columnData.id}
            data={columnData}
            onItemDropped={confirmUserAction}
            loading={updatingUserStatus}
          />
        ))}
        <Dialog.Container visible={confirmationPromptVisible}>
          <Dialog.Title>{exceptConfirmationTitle}</Dialog.Title>
          <Dialog.Description>{exceptConfirmationMessage}</Dialog.Description>
          <Dialog.Input onChangeText={setExceptedReason}></Dialog.Input>
          <Dialog.Button
            label="Cancel"
            onPress={() => {
              toggleConfirmationPrompt();
            }}
          />
          <Dialog.Button label="Submit" onPress={handleExceptionSubmission} />
        </Dialog.Container>
      </View>
    </DraxProvider>
  );
};

export default UserStatusBoard;
