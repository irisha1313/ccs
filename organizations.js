// Initial State
import { initialState } from './initial';
import { ActionTypes } from '../constants/';

// Reducers (Modifies The State And Returns A New State)
const common = (state = initialState.organizations, action) => {
    switch (action.type) {
        case ActionTypes.RESETSTATE: {
            return initialState.organizations
        }
        case ActionTypes.SETORGANIZATIONS: {
            return {
                ...state,
                allOrganizations: action.data,
            }
        }
        case ActionTypes.SETCURRENTORGANIZATION: {
            return {
                ...state,
                currentOrganization: action.data,
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