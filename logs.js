import { v4 } from 'uuid';

import { initialState } from './initial';
import { OfflineActionTypes } from '../../../constants/SafeClear';

const updateUserPerLog = (userId, newUserData) => (existingSignedOutUser) => {
  if (existingSignedOutUser.id === userId) {
    return {
      ...existingSignedOutUser,
      ...newUserData,
    };
  }

  return existingSignedOutUser;
};

const replaceOrPushPersistedLog = (
  newLogData,
  currentState,
  lastOnlineLogPayload
) => {
  const offlineLogIndex = currentState.findIndex(
    ({ id }) => id === newLogData.id
  );

  const updatedOfflineLogs = [...currentState];

  if (offlineLogIndex !== -1) {
    updatedOfflineLogs[offlineLogIndex] = {
      ...updatedOfflineLogs[offlineLogIndex],
      ...newLogData,
    };
  } else {
    updatedOfflineLogs.push({
      ...lastOnlineLogPayload,
      ...newLogData,
    });
  }

  return updatedOfflineLogs;
};

const logs = (state = initialState.logs, action) => {
  switch (action.type) {
    case `${OfflineActionTypes.RESETOFFLINESTORAGE}/fulfilled`: {
      return initialState.logs;
    }

    case `${OfflineActionTypes.CREATEOFFLINELOG}/fulfilled`: {
      return [
        ...state,
        {
          ...action.payload,
          signedIn: [],
          excepted: [],
          signedOut: [],
          entries: [],
        },
      ];
    }

    case `${OfflineActionTypes.UPDATELOGOFFLINE}/fulfilled`: {
      const newLogData = action.payload.data;
      const lastOnlineLogPayload = action.payload.lastOnlineLogPayload;

      const updatedOfflineLogs = replaceOrPushPersistedLog(
        newLogData,
        state,
        lastOnlineLogPayload
      );

      return updatedOfflineLogs;
    }

    case `${OfflineActionTypes.CREATEUSEROFFLINE}/fulfilled`: {
      const createdUserInLog = {
        ...action.payload.data,
        poc_status_log_id: v4(),
      };
      const lastOnlineLogPayload = action.payload.lastOnlineLogPayload;

      const newLogData = {
        id: createdUserInLog.log_id,
      };

      const persistedLogsData = replaceOrPushPersistedLog(
        newLogData,
        state,
        lastOnlineLogPayload
      );

      const updatedOfflineLogs = persistedLogsData.map((existingLog) => {
        if (createdUserInLog.log_id === existingLog.id) {
          return {
            ...existingLog,
            signedOut: [...existingLog.signedOut, createdUserInLog],
          };
        }
        return existingLog;
      });
      return updatedOfflineLogs;
    }

    case `${OfflineActionTypes.UPDATEUSEROFFLINE}/fulfilled`: {
      const {
        log_id,
        statusAttributeName,
        id: userId,
        name,
        phone,
        milepost,
        lastOnlineLogPayload,
      } = action.payload;

      const newLogData = {
        id: log_id,
      };

      const persistedLogsData = replaceOrPushPersistedLog(
        newLogData,
        state,
        lastOnlineLogPayload
      );

      const updatedOfflineLogs = persistedLogsData.map((existingLog) => {
        if (log_id === existingLog.id) {
          return {
            ...existingLog,
            [statusAttributeName]: existingLog[statusAttributeName].map(
              updateUserPerLog(userId, { name, phone, milepost })
            ),
          };
        }
        return existingLog;
      });
      return updatedOfflineLogs;
    }

    case `${OfflineActionTypes.UPDATEUSERSTATUSOFFLINE}/fulfilled`: {
      const updatedStatusPayload = action.payload.data;
      const lastOnlineLogPayload = action.payload.lastOnlineLogPayload;

      const newLogData = {
        id: updatedStatusPayload.logId,
      };

      const persistedLogsData = replaceOrPushPersistedLog(
        newLogData,
        state,
        lastOnlineLogPayload
      );

      const updatedOfflineLogs = persistedLogsData.map((existingLog) => {
        if (updatedStatusPayload.logId === existingLog.id) {
          const userPayload = existingLog[updatedStatusPayload.fromStatus].find(
            ({ id }) => id === updatedStatusPayload.userId
          );
          return {
            ...existingLog,
            [updatedStatusPayload.fromStatus]: existingLog[
              updatedStatusPayload.fromStatus
            ].filter(({ id }) => id !== updatedStatusPayload.userId),
            [updatedStatusPayload.toStatus]: [
              ...existingLog[updatedStatusPayload.toStatus],
              userPayload,
            ],
          };
        }
        return existingLog;
      });
      return updatedOfflineLogs;
    }

    case `${OfflineActionTypes.CREATEENTRYOFFLINE}/fulfilled`: {
      const createdLogEntry = action.payload.data;
      const lastOnlineLogPayload = action.payload.lastOnlineLogPayload;

      const newLogData = {
        id: createdLogEntry.log_id,
      };

      const persistedLogsData = replaceOrPushPersistedLog(
        newLogData,
        state,
        lastOnlineLogPayload
      );

      const updatedOfflineLogs = persistedLogsData.map((existingLog) => {
        if (createdLogEntry.log_id === existingLog.id) {
          return {
            ...existingLog,
            entries: [...existingLog.entries, createdLogEntry],
          };
        }
        return existingLog;
      });
      return updatedOfflineLogs;
    }

    case `${OfflineActionTypes.CREATENOTEOFFLINE}/fulfilled`: {
      const newNotePayload = action.payload.newNote;
      const lastOnlineLogPayload = action.payload.lastOnlineLogPayload;
      const logId = lastOnlineLogPayload.id;

      const newLogData = {
        id: logId,
      };

      const persistedLogsData = replaceOrPushPersistedLog(
        newLogData,
        state,
        lastOnlineLogPayload
      );

      const currentLogIndex = persistedLogsData.findIndex(
        (existingLog) => existingLog.id === logId
      );
      const currentEntryIndex = persistedLogsData[
        currentLogIndex
      ].entries.findIndex(
        (existingEntry) => existingEntry.id === newNotePayload.entry_id
      );

      const currentEntryNotes =
        persistedLogsData[currentLogIndex].entries[currentEntryIndex].notes;

      const newState = [...persistedLogsData];

      newState[currentLogIndex].entries[currentEntryIndex].notes = [
        ...currentEntryNotes,
        newNotePayload,
      ];

      return newState;
    }

    default: {
      return state;
    }
  }
};

export default logs;
