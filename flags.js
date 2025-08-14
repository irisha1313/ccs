import moment from 'moment-timezone';
import { Colors } from '../constants';
import { FsAlert } from '../components/CustomComponents';
import { store } from '../store/store';

export const getFlagIcon = (type) => {
  switch (type) {
    case 'red':
      return 'darkred';
    case 'yellow-red':
      return 'orange';
    case 'lh':
      return Colors.primary;
    case 'rh':
      return Colors.secondarySharp;
    case 'switch':
      return Colors.secondarySharpDark;
    default:
      return 'orange';
  }
};

export const getFlagCoordinate = (flag) => {
  return {
    latitude: flag.established_gps_lat,
    longitude: flag.established_gps_long,
  };
};

export const buildFlagMarkerLabel = (flag, isDerail, isFormB) => {
  return isDerail && flag.type !== 'red'
    ? '{}: {}\n{}'.format(
        flag.type.toUpperCase(),
        flag.serial_number,
        flag.is_established ? 'OPEN' : 'CLOSED'
      )
    : isFormB || (isDerail && flag.type === 'red')
    ? 'MP {}\n{}'.format(
        flag.mile_post,
        flag.is_established ? 'OPEN' : 'CLOSED'
      )
    : '{} - {}\n{}'.format(
        flag.mile_post,
        flag.serial_number,
        flag.is_established ? 'OPEN' : 'CLOSED'
      );
};

export const formBIsActive = (formB) => {
  const currentDate = moment().format('YYYY-MM-DD');
  if (!formB?.activeDates || !formB.activeDates.length) {
    return false;
  }

  return Boolean(formB.activeDates.find(({ date }) => date === currentDate));
};

export const timeUntilFormbOpening = (formB) => {
  if (
    !formB?.open_time ||
    (formB.open_time && String(formB.open_time).trim() === '')
  ) {
    return undefined;
  }

  const openTimeChunks = formB.open_time.split(':');
  const timeDifferenceInMinutes = moment
    .duration(
      moment
        .tz(formB.timezone)
        .hours(openTimeChunks[0])
        .minutes(openTimeChunks[1])
        .diff(moment())
    )
    .asMinutes();

  if (timeDifferenceInMinutes > 0) {
    if (timeDifferenceInMinutes > 60) {
      const differenceInHours = (timeDifferenceInMinutes / 60).toFixed(0);
      if (timeDifferenceInMinutes > 120) {
        return `${differenceInHours} hours`;
      }
      return `${differenceInHours} hour`;
    } else if (timeDifferenceInMinutes > 1) {
      return `${timeDifferenceInMinutes.toFixed(0)} minutes`;
    }
    return `${timeDifferenceInMinutes.toFixed(0)} minute`;
  }
  return 0;
};

export const getFlagType = ({ type }) => ({
  isDerail: type === 'rh' || type === 'lh',
  isFormB: type === 'red' || type === 'yellow-red',
  isSwitchLocks: type === 'switch',
});

export const verifyIfWillBeCancelledEarly = async (formBId) => {
  const currentState = store.getState();

  const currentFormBData = currentState.formbs.data.find(
    ({ id }) => id === formBId
  );

  if (!formBIsActive(currentFormBData)) {
    return false;
  }

  const flagsWithinFormB = currentFormBData.items;

  const flagsLeftOpen = flagsWithinFormB.filter(
    ({ is_established }) => is_established
  ).length;

  const currentOrgData = currentState.organizations.currentOrganization;
  const earlyCancelThreshold =
    currentOrgData.settings.flagmen_early_cancel_theshold;

  const formBsCloseTimeThresholdInMinutes = moment
    .duration(earlyCancelThreshold)
    .asMinutes();

  const timeUntilEndInMinutes = moment(
    currentFormBData.close_time,
    'HH:mm:ss'
  ).diff(moment(), 'minutes');

  // if there's already an ongoing early cancel
  // then, we should prevent another one from
  // being triggered
  // if the threshold to close flags within the org
  // is higher than the time difference until a
  // protection gets closed then, we should skip
  // this flow
  // if this is the last open item, the flow
  // shouldn't be triggered
  if (
    currentFormBData.expires_at ||
    timeUntilEndInMinutes <= formBsCloseTimeThresholdInMinutes ||
    flagsLeftOpen === 1
  ) {
    return false;
  }

  const newExpirationTimeInUTC = moment
    .utc()
    .add(formBsCloseTimeThresholdInMinutes, 'minutes');

  return {
    originalExpirationTime: currentFormBData.close_time,
    newExpirationTimeInUTC,
    protectionTimezone: currentFormBData.timezone,
  };
};

export const getEarlyCancelConfirmation = async (
  originalExpirationTime,
  newExpirationTimeInUTC,
  protectionTimezone
) => {
  try {
    const formattedOriginalExpirationTime = moment(
      originalExpirationTime,
      'HH:mm:ss'
    ).format('HH:mm');
    const formatnewExpirationTimeInUTC = moment
      .parseZone(newExpirationTimeInUTC, 'HH:mm:ss')
      .tz(protectionTimezone)
      .format('HH:mm');

    await FsAlert.alertYesCancel(
      'Early Cancel',
      `Your original expiration time was set for ${formattedOriginalExpirationTime}. Closing this flag now will initiate the cancel early process and your new expiration time for today will be ${formatnewExpirationTimeInUTC}. Press confirm to start the process or cancel to exit.`,
      'Confirm',
      'Cancel'
    );
    return true;
  } catch (error) {
    return false;
  }
};

export const getOngoingEarlyCancel = async (formBId) => {
  const currentState = store.getState();
  const currentFormBData = currentState.formbs.data.find(
    ({ id }) => id === formBId
  );

  const currentExpirationTime = currentFormBData.expires_at;

  if (currentExpirationTime) {
    const formatExpirationTimeInUTC = moment
      .parseZone(currentExpirationTime)
      .tz(currentFormBData.timezone)
      .format('HH:mm');
    FsAlert.alertOk(
      'Ongoing Early Cancel',
      `Your protection is set to be early closed at ${formatExpirationTimeInUTC}. Please make sure you stop the ongoing early cancel before opening this flag.`
    );
    return true;
  }

  return false;
};
