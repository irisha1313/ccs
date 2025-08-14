import { initialState } from './initial';
import { OfflineActionTypes } from '../../../constants/SafeClear';

const replaceOrPushPersistedEntry = (
  newEntryData,
  currentState,
  lastOnlineEntryPayload
) => {
  const offlineEntryIndex = currentState.findIndex(
    ({ id }) => id === newEntryData.id
  );

  const entriesData = [...currentState];

  if (offlineEntryIndex !== -1) {
    entriesData[offlineEntryIndex] = {
      ...entriesData[offlineEntryIndex],
      ...newEntryData,
    };
  } else {
    entriesData.push({
      ...lastOnlineEntryPayload,
      ...newEntryData,
    });
  }

  return entriesData;
};

const entries = (state = initialState.entries, action) => {
  switch (action.type) {
    case `${OfflineActionTypes.RESETOFFLINESTORAGE}/fulfilled`: {
      return initialState.entries;
    }

    case `${OfflineActionTypes.CREATEENTRYOFFLINE}/fulfilled`: {
      return [...state, action.payload.data];
    }

    case `${OfflineActionTypes.CREATENOTEOFFLINE}/fulfilled`: {
      const newNotePayload = action.payload.newNote;
      const lastOnlineEntryPayload = action.payload.lastOnlineEntryPayload;

      const newEntryData = {
        id: newNotePayload.entry_id,
      };

      const persistedEntriesData = replaceOrPushPersistedEntry(
        newEntryData,
        state,
        lastOnlineEntryPayload
      );

      return persistedEntriesData.map((existingEntry) => {
        if (existingEntry.id === newNotePayload.entry_id) {
          return {
            ...existingEntry,
            notes: [...existingEntry.notes, newNotePayload],
          };
        }
        return existingEntry;
      });
    }

    default: {
      return state;
    }
  }
};

export default entries;
