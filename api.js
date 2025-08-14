import axios from 'axios';
import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';
import { NavigationActions } from 'react-navigation';

import { parseJwt } from './parseJwt';
import storage from './storage';
import ErrorMessages from '../constants/ErrorMessages';
import * as userActions from '../actions/user';
import { store } from '../store/store';
import { Screens } from '../constants/index';
import { showToast } from '../utils/common';

const format = require('string-format');
format.extend(String.prototype, {});

export const tokensStorage = new Map();
const REFRESH_TOKEN_KEY = 'rt';

let isOfflineMode = false;
export const toggleOfflineMode = (val) => {
  isOfflineMode = val;
};

export const updateTokens = (data) => {
  tokensStorage.set('access_token', data.access_token);
  tokensStorage.set('refresh_token', data.refresh_token);
  storage.set(REFRESH_TOKEN_KEY, data.refresh_token);
};

export const refreshTokens = async () => {
  let refreshToken =
    tokensStorage.get('refresh_token') ||
    (await storage.get(REFRESH_TOKEN_KEY));
  if (refreshToken && !isOfflineMode) {
    try {
      const { data } = await axios.post(
        `${Constants.expoConfig.extra.api_url}/auth/refresh`,
        { refreshToken }
      );
      console.log('try data:', data);
      updateTokens(data);
    } catch (e) {
      // resetting tokens
      logout();
      // emptying the store
      store.dispatch(userActions.logoutUser());
      store.dispatch(
        NavigationActions.navigate({
          routeName: Screens.SignOutStack.route,
        })
      );
      showToast('Session expired. Please log back in.', 'warning');
    }
  }
};

export const logout = async () => {
  updateTokens({ access_token: '', refresh_token: '' });
};

export const getUserFromAccessToken = () => {
  const { sub, username, email, role_id } = parseJwt(
    tokensStorage.get('access_token')
  );
  return {
    id: sub,
    username,
    email,
    role_id,
  };
};

const api = axios.create({
  baseURL: Constants.expoConfig.extra.api_url,
  timeout: 15 * 1000,
});

api.interceptors.request.use(
  (config) => {
    if (isOfflineMode) {
      throw new Error(ErrorMessages.NOINTERNET);
    } else {
      const accessToken = tokensStorage.get('access_token');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    }
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          await refreshTokens();
          return api(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    Sentry.Native.setExtra('error', err);
    Sentry.Native.captureException(err);
    return Promise.reject(err);
  }
);

export default api;
