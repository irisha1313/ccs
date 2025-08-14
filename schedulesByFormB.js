// Initial State
import { initialState } from './initial';
import { ActionTypes } from '../constants';

// Reducers (Modifies The State And Returns A New State)
const common = (state = initialState.flagsByFormB, action) => {
    switch (action.type) {
        case ActionTypes.RESETSTATE: {
            return initialState.schedules
        }
        case ActionTypes.SETFORMBSSCHEDULES: {
            return {
                ...state,
                data: action.data,
            }
        }
        case ActionTypes.UPDATEFORMBSSCHEDULES: {
            const { protection_id } = action.data;
            const updatedSchedules = state.data;
            updatedSchedules[protection_id] = action.data;
            return {
                ...state,
                data: updatedSchedules,
            }
        }
        case ActionTypes.RESETFORMBSSCHEDULES: {
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
