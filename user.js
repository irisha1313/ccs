import { initialState } from './initial';
import { ActionTypes } from '../../constants/SafeClear';

const user = (state = initialState.user, action) => {
  switch (action.type) {
    case ActionTypes.SETUSERDATA: {
      return action.userData;
    }
    default: {
      return state;
    }
  }
};

export default user;
