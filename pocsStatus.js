import { v4 } from 'uuid';

import { initialState } from './initial';
import { OfflineActionTypes } from '../../../constants/SafeClear';

const pocsStatus = (state = initialState.pocsStatus, action) => {
  switch (action.type) {
    case `${OfflineActionTypes.RESETOFFLINESTORAGE}/fulfilled`: {
      return initialState.pocsStatus;
    }

    case `${OfflineActionTypes.CREATEUSEROFFLINE}/fulfilled`: {
      const createdUser = action.payload.data;

      return [
        ...state,
        {
          id: v4(),
          poc_id: createdUser.id,
          log_id: createdUser.log_id,
          status: 'signedOut',
          created_at: createdUser.created_at,
          created_by: createdUser.created_by,
        },
      ];
    }

    case `${OfflineActionTypes.UPDATEUSERSTATUSOFFLINE}/fulfilled`: {
      const updatedStatusPayload = action.payload.data;

      return [
        ...state,
        {
          id: v4(),
          poc_id: updatedStatusPayload.userId,
          log_id: updatedStatusPayload.logId,
          status: updatedStatusPayload.toStatus,
          reason: updatedStatusPayload.reason,
          created_at: updatedStatusPayload.created_at,
          created_by: updatedStatusPayload.created_by,
        },
      ];
    }

    default: {
      return state;
    }
  }
};

export default pocsStatus;
