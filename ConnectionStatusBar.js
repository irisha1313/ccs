import React, { useContext, useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { FsAlert } from '../../components/CustomComponents';
import { useIsOnline, netStateContext } from '../../context/netStateContext';
import { Colors } from '../../constants';

const ConnectionStatusBar = () => {
  const isOnline = useIsOnline();
  const slideAnim = useRef(new Animated.Value(0)).current;

  const { retryConnection } = useContext(netStateContext);

  const handleRetryConnection = async () => {
    const connectionRestored = await retryConnection();

    if (!connectionRestored) {
      FsAlert.alertOk(
        'Unable to restore connection',
        "Your connection was unable to be restored. Please check your device's current connection to make sure it can reach the internet."
      );
    } else {
      FsAlert.alertOk(
        'Connection Restored',
        'Your connection has been successfully restored.'
      );
    }
  };

  useEffect(() => {
    if (isOnline) {
      Animated.timing(slideAnim, {
        toValue: 40,
        duration: 500,
        delay: 2000,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isOnline]);

  return (
    <Animated.View
      style={{
        backgroundColor: isOnline ? Colors.secondarySharpDark : Colors.redDark,
        flexDirection: 'row',
        paddingHorizontal: 10,
        height: 26,
        paddingVertical: 2,
        transform: [{ translateY: slideAnim }],
      }}
      onTouchEnd={!isOnline && handleRetryConnection}
    >
      <MaterialCommunityIcons
        name={isOnline ? 'signal' : 'signal-off'}
        color={Colors.white}
        size={16}
      />
      <Text style={{ marginLeft: 10, color: Colors.white }}>
        {isOnline ? `You're back online` : 'You are offline. Tap to retry.'}
      </Text>
    </Animated.View>
  );
};

export default ConnectionStatusBar;
