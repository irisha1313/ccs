import omit from 'lodash/omit';

import { initialState } from './initial';
import { ActionTypes } from '../../constants/SafeClear';

// this double possibility sorting
// is necessary due to users
// inputing letters + numbers
// as mileposts
const sortUsersByMilepost = (a, b) => {
  if (!a || !b) {
    return false;
  }

  const numericValueA = Number(a.milepost);
  const numericValueB = Number(b.milepost);

  if (isNaN(numericValueA) || isNaN(numericValueB)) {
    return (
      Number(a.milepost.match(/(\d+)/g)[0]) -
      Number(b.milepost.match(/(\d+)/g)[0])
    );
  }
  return numericValueA > numericValueB ? 1 : -1;
};

const currentLog = (state = initialState.currentLog, action) => {
  switch (action.type) {
    case `${ActionTypes.SETCURRENTLOG}/pending`: {
      return initialState.currentLog;
    }
    case `${ActionTypes.SETCURRENTLOG}/fulfilled`: {
      return { ...state, data: action.payload, loading: false };
    }

    case `${ActionTypes.UPDATECURRENTLOG}/pending`: {
      return { ...state, loading: true };
    }
    case `${ActionTypes.UPDATECURRENTLOG}/fulfilled`: {
      return {
        ...state,
        data: { ...state.data, ...action.payload },
        loading: false,
      };
    }

    case `${ActionTypes.UPDATEUSERSTATUS}/pending`: {
      return { ...state, updatingUserStatus: true };
    }
    case `${ActionTypes.UPDATEUSERSTATUS}/fulfilled`: {
      const stateData = state.data;
      const { userId, fromStatus, toStatus, created_at } = action.payload;

      const oldFromData = stateData[fromStatus];
      const oldToData = stateData[toStatus];

      const userData = oldFromData.find(({ id }) => id === userId);
      const newUserData = { ...userData, created_at };

      const newFromStatus = oldFromData.filter(({ id }) => id !== userId);
      const newToStatus = [newUserData, ...oldToData].sort(sortUsersByMilepost);

      return {
        ...state,
        data: {
          ...stateData,
          [fromStatus]: newFromStatus,
          [toStatus]: newToStatus,
        },
        updatingUserStatus: false,
      };
    }

    case `${ActionTypes.REGISTERUSERTOLOG}/fulfilled`: {
      const newUser = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          signedOut: [...state.data.signedOut, newUser],
        },
      };
    }

    case `${ActionTypes.CREATEUSER}/pending`: {
      return { ...state, loadingUser: true };
    }
    case `${ActionTypes.CREATEUSER}/rejected`: {
      return { ...state, loadingUser: false };
    }
    case `${ActionTypes.CREATEUSER}/fulfilled`: {
      const newUser = action.payload.data || action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          signedOut: [...state.data.signedOut, newUser],
        },
        loadingUser: false,
      };
    }

    case `${ActionTypes.UPDATEUSER}/pending`: {
      return { ...state, loadingUser: true };
    }
    case `${ActionTypes.UPDATEUSER}/rejected`: {
      return { ...state, loadingUser: false };
    }
    case `${ActionTypes.UPDATEUSER}/fulfilled`: {
      const user = action.payload;

      const updatedPerUserStatusData = state.data[user.statusAttributeName]
        .map((existingUser) => {
          if (existingUser?.id === user?.id) {
            return user;
          }
          return existingUser;
        })
        .sort(sortUsersByMilepost);
      const updatedData = {
        ...state.data,
        [user.statusAttributeName]: updatedPerUserStatusData,
      };
      return {
        ...state,
        data: updatedData,
        loadingUser: false,
      };
    }

    case `${ActionTypes.CREATEENTRY}/fulfilled`: {
      const newEntry = action.payload;
      const newSortedEntries = [...state.data.entries, newEntry].sort(
        (a, b) => {
          if (a && b) return a.id < b.id;
          return false;
        }
      );
      return {
        ...state,
        data: {
          ...state.data,
          entries: newSortedEntries,
        },
      };
    }

    case `${ActionTypes.CREATENOTE}/fulfilled`: {
      const { newNote, entryId } = action.payload;
      const updatedEntries = state.data.entries.map((existingEntry) => {
        if (existingEntry.id === entryId) {
          return {
            ...existingEntry,
            notes: [...existingEntry.notes, newNote],
          };
        }
        return existingEntry;
      });
      return {
        ...state,
        data: {
          ...state.data,
          entries: updatedEntries,
        },
      };
    }

    default: {
      return state;
    }
  }
};

export default currentLog;
