import { initialState } from './initial';
import { OfflineActionTypes } from '../../../constants/SafeClear';

const replaceOrPushPersistedPOC = (
  newPOCData,
  currentState,
  lastOnlineLogPayload
) => {
  const offlinePOCIndex = currentState.findIndex(
    ({ id }) => id === newPOCData.id
  );

  const POCsData = [...currentState];

  if (offlinePOCIndex !== -1) {
    POCsData[offlinePOCIndex] = {
      ...POCsData[offlinePOCIndex],
      ...newPOCData,
    };
  } else {
    const { id: log_id, signedIn, signedOut, excepted } = lastOnlineLogPayload;
    const lastOnlinePOCData = [...signedIn, ...signedOut, ...excepted].find(
      (lastOnlinePOC) => lastOnlinePOC.id === newPOCData.id
    );

    POCsData.push({
      ...lastOnlinePOCData,
      ...newPOCData,
      log_id,
    });
  }

  return POCsData;
};

const pocs = (state = initialState.pocs, action) => {
  switch (action.type) {
    case `${OfflineActionTypes.RESETOFFLINESTORAGE}/fulfilled`: {
      return initialState.pocs;
    }

    case `${OfflineActionTypes.CREATEUSEROFFLINE}/fulfilled`: {
      return [...state, action.payload.data];
    }

    case `${OfflineActionTypes.UPDATEUSEROFFLINE}/fulfilled`: {
      const { id, name, phone, milepost, lastOnlineLogPayload } =
        action.payload;

      const updatedPOCData = { id, name, phone, milepost };

      const updatedPOCs = replaceOrPushPersistedPOC(
        updatedPOCData,
        state,
        lastOnlineLogPayload
      );

      return updatedPOCs;
    }

    default: {
      return state;
    }
  }
};

export default pocs;
