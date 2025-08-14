// Initial State
import { initialState } from './initial';
import { ActionTypes } from '../constants/';

// Reducers (Modifies The State And Returns A New State)
const common = (state = initialState.formbs, action) => {
  switch (action.type) {
    case ActionTypes.RESETSTATE: {
      return initialState.formbs;
    }
    case ActionTypes.SETFORMBS: {
      return {
        ...state,
        data: action.data,
      };
    }
    case ActionTypes.SETFORMB: {
      if (!state.data) return state;
      const newData = [...state.data];
      const key = newData.findIndex(({ id }) => id === action.data.id);
      if (key >= 0) newData[key] = action.data;
      return {
        ...state,
        data: newData,
      };
    }
    case ActionTypes.CREATEFORMBS: {
      const newFormB = action.data;
      const updatedFormBs = state.data.concat(newFormB);
      return {
        ...state,
        data: updatedFormBs,
      };
    }
    case ActionTypes.UPDATEFORMBS: {
      const updatedFormB = action.data;
      const modifiedFormBIndex = state.data.findIndex(
        (formB) => formB.id === updatedFormB.id
      );
      const updatedState = state.data;
      updatedState[modifiedFormBIndex] = updatedFormB;
      return {
        ...state,
        data: updatedState,
      };
    }
    case ActionTypes.UPDATEFORMBATTRIBUTE: {
      const updatedFormB = action.data;
      const modifiedFormBIndex = state.data.findIndex(
        (formB) => formB.id === updatedFormB.id
      );
      const updatedState = state.data;
      updatedState[modifiedFormBIndex] = {
        ...updatedState[modifiedFormBIndex],
        ...updatedFormB,
      };
      return {
        ...state,
        data: updatedState,
      };
    }
    case ActionTypes.DELETEFORMB: {
      const formBId = action.data;
      const updatedState = state.data.filter((formB) => formB.id !== formBId);
      return {
        ...state,
        data: updatedState,
      };
    }
    case ActionTypes.RESETFORMBS: {
      return {
        ...state,
        data: null,
      };
    }

    // Default
    default: {
      return state;
    }
  }
};

// Exports
export default common;
