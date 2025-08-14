import React, { useContext, useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { Button } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';
import omit from 'lodash/omit';
import flatten from 'lodash/flatten';

import { netStateContext, useIsOnline } from '../../context/netStateContext';
import appStyles from '../../theme/appStyles';
import { Colors, Fonts } from '../../constants';
import { Screens as SafeClearScreens } from '../../constants/SafeClear';
import LoadingModal from '../../components/LoadingModal';
import {
  syncLogs,
  syncEntries,
  syncPOCs,
  syncPOCsStatus,
  syncPOCsStatusLogs,
  syncPOCsStatusLogsReasons,
  syncEntryNotes,
  resetOfflineStorage,
} from '../../actions/SafeClear/offline/logs';
import { Logo } from '../../components';
import { tokensStorage } from '../../utils/api';

const getActiveRouteState = function (route) {
  if (
    !route.routes ||
    route.routes.length === 0 ||
    route.index >= route.routes.length
  ) {
    return route;
  }

  const childActiveRoute = route.routes[route.index];
  return getActiveRouteState(childActiveRoute);
};

const BackOnlineModal = () => {
  const [syncingOfflineData, setSyncingOfflineData] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Initializing Sync');
  const [syncProgress, setReportUploadingProgress] = useState('indeterminate');

  const dispatch = useDispatch();
  const isOnline = useIsOnline();
  const user = useSelector((state) => state.auth.user);
  const offlineData = useSelector((state) => state.offline.safeClear);

  const pendingChanges = Object.values(offlineData).some(
    (offlineDataBatch) => offlineDataBatch.length
  );

  const usersWithSelfAccessToSafeClear = [
    'hflans@gmail.com',
    'travis.ford@railpros.com',
    'brian.mazur@railpros.com',
    'robert.grapes@railpros.com',
    'michael.grether@railpros.com',
  ];

  const isAbleToAccessSafeClearAsFlagman =
    usersWithSelfAccessToSafeClear.includes(user?.email?.toLowerCase());

  const userIsAuthedWithAPI = Boolean(
    tokensStorage.get('access_token') && tokensStorage.get('refresh_token')
  );

  const modalIsVisible =
    userIsAuthedWithAPI &&
    isAbleToAccessSafeClearAsFlagman &&
    isOnline &&
    pendingChanges;

  const { enableOfflineMode } = useContext(netStateContext);

  const handleOfflineMode = () => {
    enableOfflineMode();
    dispatch(
      NavigationActions.navigate({
        routeName: SafeClearScreens.Home.route,
        params: { userData: user },
      })
    );
  };

  const delay = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  const getOfflineDataToSync = () => {
    const logsSettingsToSync = offlineData.logs.map((logData) =>
      omit(logData, ['entries', 'excepted', 'signedIn', 'signedOut'])
    );
    const newPOCsToSync = offlineData.pocs.map((POCData) =>
      omit(POCData, ['log_id', 'milepost'])
    );
    const pocStatusesToSync = flatten(
      offlineData.logs.map(({ id: logId, excepted, signedIn, signedOut }) => {
        const exceptedPOCStatuses = excepted.map(
          (exceptedPOC) =>
            exceptedPOC && {
              id: exceptedPOC.poc_status_log_id,
              log_id: logId,
              poc_id: exceptedPOC.id,
              milepost: exceptedPOC.milepost,
              created_at: exceptedPOC.created_at,
              created_by: exceptedPOC.created_by,
              status: 'excepted',
            }
        );
        const signedInPOCStatuses = signedIn.map(
          (signedInPOC) =>
            signedInPOC && {
              id: signedInPOC.poc_status_log_id,
              log_id: logId,
              poc_id: signedInPOC.id,
              milepost: signedInPOC.milepost,
              created_at: signedInPOC.created_at,
              created_by: signedInPOC.created_by,
              status: 'signedIn',
            }
        );
        const signedOutPOCStatuses = signedOut.map(
          (signedOutPOC) =>
            signedOutPOC && {
              id: signedOutPOC.poc_status_log_id,
              log_id: logId,
              poc_id: signedOutPOC.id,
              milepost: signedOutPOC.milepost,
              created_at: signedOutPOC.created_at,
              created_by: signedOutPOC.created_by,
              status: 'signedOut',
            }
        );

        return [
          ...exceptedPOCStatuses,
          ...signedInPOCStatuses,
          ...signedOutPOCStatuses,
        ].filter(Boolean);
      })
    );
    const newPOCStatusLogsToSync = offlineData.pocsStatus.map((POCStatusLog) =>
      omit(POCStatusLog, 'reason')
    );
    const newPOCStatusLogReasonsToSync = offlineData.pocsStatus
      .map(
        (POCStatusLog) =>
          POCStatusLog.reason && {
            ...omit(POCStatusLog, ['id', 'log_id', 'poc_id', 'status']),
            poc_status_log_id: POCStatusLog.id,
          }
      )
      .filter(Boolean);

    const newEntriesToSync = offlineData.entries.map((entryData) =>
      omit(entryData, ['notes'])
    );
    const newEntryNotesToSync = flatten(
      offlineData.entries.map(({ notes }) => notes)
    );

    return {
      logsSettingsToSync,
      newPOCsToSync,
      pocStatusesToSync,
      newPOCStatusLogsToSync,
      newPOCStatusLogReasonsToSync,
      newEntriesToSync,
      newEntryNotesToSync,
    };
  };

  const handleSyncData = async () => {
    setSyncingOfflineData(true);
    const {
      logsSettingsToSync,
      newPOCsToSync,
      pocStatusesToSync,
      newPOCStatusLogsToSync,
      newPOCStatusLogReasonsToSync,
      newEntriesToSync,
      newEntryNotesToSync,
    } = getOfflineDataToSync();

    setReportUploadingProgress(0);

    if (logsSettingsToSync.length) {
      setSyncStatus('Syncing Log Settings');
      await syncLogs(logsSettingsToSync);
    }

    setReportUploadingProgress(0.14);

    if (newPOCsToSync.length) {
      setSyncStatus('Syncing POCs');
      await syncPOCs(newPOCsToSync);
    }

    setReportUploadingProgress(0.28);

    if (pocStatusesToSync.length) {
      setSyncStatus('Syncing POC Statuses');
      await syncPOCsStatus(pocStatusesToSync);
    }

    setReportUploadingProgress(0.42);

    if (newPOCStatusLogsToSync.length) {
      setSyncStatus('Syncing POC Status Logs');
      await syncPOCsStatusLogs(newPOCStatusLogsToSync);
    }

    setReportUploadingProgress(0.56);

    if (newPOCStatusLogReasonsToSync.length) {
      setSyncStatus('Syncing POC Exception Reasons');
      await syncPOCsStatusLogsReasons(newPOCStatusLogReasonsToSync);
    }

    setReportUploadingProgress(0.7);

    if (newEntriesToSync.length) {
      setSyncStatus('Syncing Entries');
      await syncEntries(newEntriesToSync);
    }

    setReportUploadingProgress(0.84);

    if (newEntryNotesToSync.length) {
      setSyncStatus('Syncing Entry Notes');
      await syncEntryNotes(newEntryNotesToSync);
    }

    setSyncStatus('Syncing Finished!');
    setReportUploadingProgress(1);

    await dispatch(resetOfflineStorage());

    await delay(1500);

    setSyncingOfflineData(false);
  };

  if (syncingOfflineData) {
    return <LoadingModal visible progress={syncProgress} status={syncStatus} />;
  }

  return (
    <Modal animationType="slide" transparent={false} visible={modalIsVisible}>
      <Logo style={{ height: 68, width: 220 }} />
      <Text
        style={{
          textAlign: 'center',
          fontSize: Fonts.size.xxbig,
          fontWeight: 'bold',
          marginTop: 20,
        }}
      >
        Connection Restored
      </Text>
      <Text
        style={{
          fontSize: Fonts.size.normal,
          marginTop: 20,
          marginLeft: 25,
        }}
      >
        You can switch back online to sync your unsaved progress or, keep
        editing offline.
      </Text>
      <View style={{ alignItems: 'center', flex: 1 }}>
        <View style={{ flexDirection: 'row', marginTop: 140 }}>
          <View style={{ width: 180, marginRight: 16 }}>
            <Button
              full
              primary
              style={appStyles.btnSecontary}
              onPress={handleOfflineMode}
            >
              <Text style={{ color: Colors.white, paddingHorizontal: 16 }}>
                Keep editing offline
              </Text>
            </Button>
          </View>
          <View style={{ width: 180 }}>
            <Button
              full
              primary
              style={appStyles.btnSecontary}
              onPress={handleSyncData}
            >
              <Text style={{ color: Colors.white, paddingHorizontal: 16 }}>
                Sync Changes
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BackOnlineModal;
