// Initial State
import { initialState } from './initial';
import { ActionTypes } from '../constants/';

// Reducers (Modifies The State And Returns A New State)
const common = (state = initialState.flagsByFormB, action) => {
    switch (action.type) {
        case ActionTypes.RESETSTATE: {
            return initialState.flagsByFormB
        }
        case ActionTypes.SETFLAGSBYFORMB: {
            return {
                ...state,
                data: action.data,
            }
        }
        case ActionTypes.UPDATEFLAGSBYFORMB: {
            const { flags, formBId } = action.data;
            const updatedFlags = state.data;
            updatedFlags[formBId] = flags;
            return {
                ...state,
                data: updatedFlags,
            }
        }
        case ActionTypes.RESETFLAGSBYFORMB: {
            return {
                ...state,
                data: {},
            }
        }

        // Default
        default: {
            return state;
        }
    }
};

// Exports
export default common;