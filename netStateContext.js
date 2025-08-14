import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import _ from 'lodash';
import { toggleOfflineMode } from '../utils/api';

export const netStateContext = createContext({ isOnline: false });

export const useIsOnline = () => useContext(netStateContext).isOnline;

const NetStateProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({ isConnected }) => {
      setIsOnline(isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => toggleOfflineMode(!isOnline), [isOnline]);

  const enableOfflineMode = () => {
    setIsOnline(false);
  };

  const retryConnection = async () => {
    const { isConnected } = await NetInfo.fetch();

    if (isConnected !== isOnline) {
      setIsOnline(isConnected);
    }

    return isConnected;
  };

  return (
    <netStateContext.Provider
      value={{
        isOnline,
        enableOfflineMode,
        retryConnection,
      }}
    >
      {children}
    </netStateContext.Provider>
  );
};

export default NetStateProvider;
