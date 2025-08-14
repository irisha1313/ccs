export const initialState = {
  user: {},
  currentLog: {
    loading: false,
    loadingUser: false,
    updatingUserStatus: false,
    data: {
      signedIn: [],
      excepted: [],
      signedOut: [],
      entries: [],
    },
  },
  logs: {
    submitted: [],
    unsubmitted: [],
    loading: false,
    editingLog: false,
  },
};
