import { initialState } from './initial';
import { ActionTypes } from '../../constants/SafeClear';

const logs = (state = initialState.logs, action) => {
  switch (action.type) {
    case `${ActionTypes.SETLOGS}/pending`: {
      return { ...initialState.logs, unsubmitted: [...state.unsubmitted] };
    }
    case `${ActionTypes.SETLOGS}/fulfilled`: {
      const newLogsData = { ...action.payload };
      const newUnsubmittedLogs = [...action.payload.unsubmitted];

      const presentInArray = {};

      newLogsData.unsubmitted = [
        ...state.unsubmitted,
        ...newUnsubmittedLogs,
      ].filter(
        (log) =>
          !log.submitted_at &&
          !presentInArray[log.id] &&
          (presentInArray[log.id] = true)
      );

      return { ...newLogsData, loading: false };
    }
    case `${ActionTypes.SETCURRENTLOG}/fulfilled`: {
      const newLogData = action.payload;

      const updatedUnsubmittedLogs = state.unsubmitted.map((log) => {
        if (log.id === newLogData.id) {
          return newLogData;
        }
        return log;
      });

      return {
        ...state,
        unsubmitted: updatedUnsubmittedLogs,
      };
    }

    case `${ActionTypes.CREATELOG}/pending`: {
      return { ...state, editingLog: true };
    }
    case `${ActionTypes.CREATELOG}/fulfilled`: {
      return {
        ...state,
        unsubmitted: [...state.unsubmitted, action.payload],
        editingLog: false,
      };
    }
    case `${ActionTypes.CREATELOG}/rejected`: {
      return {
        ...state,
        editingLog: false,
      };
    }

    case `${ActionTypes.UPDATELOG}/pending`: {
      return { ...state, editingLog: true };
    }
    case `${ActionTypes.UPDATELOG}/fulfilled`: {
      const updatedLog = action.payload;
      const updatedUnsubmittedLogs = state.unsubmitted.map((existingLog) => {
        if (updatedLog.id === existingLog.id) {
          return updatedLog;
        }
        return existingLog;
      });
      return {
        ...state,
        unsubmitted: updatedUnsubmittedLogs,
        editingLog: false,
      };
    }
    case `${ActionTypes.UPDATELOG}/rejected`: {
      return { ...state, editingLog: false };
    }

    default: {
      return state;
    }
  }
};

export default logs;
