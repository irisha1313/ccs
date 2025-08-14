import { fire } from 'react-native-alertbox';

import { FsAlert } from '../../components/CustomComponents';
import { User } from '../../constants/SafeClear/index';
import { updateUserStatus } from '../../actions/SafeClear/currentLog';

export const getPossessiveName = (name) =>
  name.charAt(name.length - 1) === 's' ? `${name}'` : `${name}'s`;

const fireConfirmationAlert = (content) => {
  try {
    fire(content);
  } catch (error) {}
};

const handleExceptedUser =
  (confirmationTitle, user, currentLogId, fromStatus) => (dispatch) => {
    const confirmationAlertContent = {
      title: confirmationTitle,
      message: `Why is ${user.name} being excepted?`,
      actions: [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: ({ reason }) => {
            if (!reason) {
              FsAlert.alertOk(
                'Invalid Reason',
                "Please make sure to fill this exception's reason."
              );
              return fireConfirmationAlert(confirmationAlertContent);
            }

            dispatch(
              updateUserStatus({
                userId: user.id,
                logId: currentLogId,
                fromStatus,
                toStatus: User.statusMap.excepted.attributeName,
                reason,
              })
            );
          },
        },
      ],
      fields: [
        {
          name: 'reason',
          placeholder: 'Reason',
        },
      ],
    };

    fireConfirmationAlert(confirmationAlertContent);
  };

export const manageUserStatusUpdate =
  (selectedOption, user, currentLogId, fromStatus) => async (dispatch) => {
    const confirmationTitle = `${selectedOption} ${user.name}`;

    if (selectedOption === User.statusMap.excepted.verb) {
      return dispatch(
        handleExceptedUser(confirmationTitle, user, currentLogId, fromStatus)
      );
    }

    await FsAlert.alertYesCancel(
      confirmationTitle,
      `Are you sure you want to ${selectedOption.toLowerCase()} ${user.name}?`
    );

    const toStatus = Object.values(User.statusMap).find(
      (value) => value.verb === selectedOption
    ).attributeName;
    dispatch(
      updateUserStatus({
        userId: user.id,
        logId: currentLogId,
        fromStatus,
        toStatus,
      })
    );
  };

export const handleAddUserToLog = (NavigationActions) => (dispatch) => {
  dispatch(
    NavigationActions.navigate({
      routeName: 'SafeClearCreateUserScreen',
    })
  );
};

export const handleEditUserInLog =
  (NavigationActions, userWithStatus) => (dispatch) => {
    dispatch(
      NavigationActions.navigate({
        routeName: 'SafeClearCreateUserScreen',
        params: { user: userWithStatus },
      })
    );
  };
