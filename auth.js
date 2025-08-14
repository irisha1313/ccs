// Initial State
import { initialState } from './initial';
import { ActionTypes } from '../constants/';

// Reducers (Modifies The State And Returns A New State)
const auth = (state = initialState.auth, action) => {
  switch (action.type) {
    case ActionTypes.RESETSTATE: {
      return initialState.auth;
    }
    case ActionTypes.LANGUAGECODE: {
      return {
        ...state,
        language: action.language,
        languageId: action.languageId,
        languageSet: action.languageSet,
      };
    }
    case ActionTypes.SHOWINTRO: {
      return {
        ...state,
        showIntro: action.showIntro,
      };
    }

    case ActionTypes.LOGIN: {
      return {
        ...state,
        user: action.data,
      };
    }
    case ActionTypes.UPDATEUSER: {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.data,
        },
      };
    }
    // Default
    default: {
      return state;
    }
  }
};

// Exports
export default auth;
