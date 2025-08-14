import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Spinner } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import { NavigationActions } from 'react-navigation';

import { Colors, Icons } from '../constants';
import { FsText, FsButtonActionIcon, FsAlert } from './CustomComponents';
import { reportForDuty, debrief } from '../actions/user';
import { getHasAlreadyReportedToDuty } from '../sharedMethods/users';
import {
  startBackgroundLocationTracking,
  stopBackgroundLocationTracking,
} from '../sharedMethods/location';

const onPress = (userData, setLoading, callback) => async (dispatch) => {
  setLoading(true);
  const isOnDuty = getHasAlreadyReportedToDuty(userData);
  if (isOnDuty) {
    try {
      await FsAlert.alertYesCancel(
        `Dispatch Verification`,
        'Have all applicable protections been released back to dispatch or appropriate person?',
        'Yes',
        'No'
      );
      await dispatch(debrief(userData.id, {
        last_debriefed_at_utc: moment().utc().format('YYYY-MM-DDTHH:mm:ssZ'),
        last_debriefed_timezone: moment.tz.guess(),
      }));
      // stopBackgroundLocationTracking(); // temporal - disabling background location tracking

      if (callback) callback();
    } catch (error) {}
    setLoading(false);
  } else {
    await dispatch(reportForDuty(userData.id, {
      last_reported_to_duty_at_utc: moment().utc().format('YYYY-MM-DDTHH:mm:ssZ'),
      last_reported_to_duty_timezone: moment.tz.guess(),
    }));
    // startBackgroundLocationTracking(); // temporal - disabling background location tracking

    if (callback) callback();
    setLoading(false);
  }
};

const ReportForDutyButton = ({ style, callback }) => {
  const [loading, setLoading] = useState(false);
  const [hasReportedForDuty, setHasReportedForDuty] = useState(false);
  const { userData } = useSelector((state) => ({
    userData: state.auth.user,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    const isOnDuty = getHasAlreadyReportedToDuty(userData);

    if (isOnDuty) {
      setHasReportedForDuty(true);
    } else {
      setHasReportedForDuty(false);
    }
  }, [userData]);

  return (
    <FsButtonActionIcon
      title=""
      style={{
        backgroundColor: hasReportedForDuty ? Colors.redDark : Colors.secondary,
        ...style,
      }}
      onPress={() => dispatch(onPress(userData, setLoading, callback))}
      renderIcon={(color) =>
        loading ? (
          <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
            <Spinner
              color={Colors.textLight}
              style={{ height: 15, paddingLeft: 15, paddingTop: 5 }}
            />
          </View>
        ) : (
          <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
            <MaterialCommunityIcons
              name={hasReportedForDuty ? 'logout-variant' : 'hand-back-left'}
              color={color}
              size={Icons.size.normal}
            />
            <FsText style={{ color: Colors.textLight, paddingHorizontal: 8 }}>
              {hasReportedForDuty ? 'End Duty' : 'REPORT FOR DUTY'}
            </FsText>
          </View>
        )
      }
    />
  );
};

export default ReportForDutyButton;
