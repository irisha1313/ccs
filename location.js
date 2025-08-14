import { initialState } from './initial';
import { ActionTypes } from '../constants/';

const location = (state = initialState.location, action) => {
  switch (action.type) {
    case ActionTypes.SETLOCATION: {
      return {
          ...state,
          ...action.location,
      }
    }
    default: {
      return state;
    }
  }
};

export default location;