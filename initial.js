import { getLanguage } from '../utils/common';
export const initialState = {
  common: {
    isLoading: false,
    showModal: false,
  },
  auth: {
    user: {},
    showIntro: true,
    language: getLanguage(0),
    languageId: 0,
    languageSet: 0,
  },
  formbs: {
    data: null,
  },
  flagsByFormB: {
    data: {},
  },
  schedules: {
    data: {},
  },
  organizations: {
    currentOrganization: {
      settings: {},
      management: [],
      flagmen: [],
    },
    allOrganizations: [],
  },
  supervisors: {
    data: [],
  },
  location: {
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    speed: 0,
    altitude: 0,
  },
};
