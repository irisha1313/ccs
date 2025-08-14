import React, { useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Container } from 'native-base';
import { NavigationContext } from 'react-navigation';
import * as ScreenOrientation from 'expo-screen-orientation';

import AppHeader from './Header';

const ScreenView = ({
  children,
  title,
  onBackPress,
  headerActionButton,
  style,
  hasBackButton = true,
  lockToLandscape = false,
  titlePaddingRight,
}) => {
  const navigation = useContext(NavigationContext);
  const isNavigationFocus = navigation.isFocused();

  useEffect(() => {
    if (lockToLandscape) {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      );
    } else {
      ScreenOrientation.unlockAsync();
    }
  }, [isNavigationFocus]);

  return (
    <Container style={style}>
      <AppHeader
        hasBackButton={hasBackButton}
        title={title}
        onBackPress={onBackPress}
        actionButton={headerActionButton}
        titlePaddingRight={titlePaddingRight}
      ></AppHeader>
      <SafeAreaView style={{ flex: 1 }} edges={['right', 'left']}>
        {children}
      </SafeAreaView>
    </Container>
  );
};
export default ScreenView;

export const createScreen = (
  component,
  { actionButton = null, title, hasBackButton = true, onBackPress }
) => {
  return (
    <ScreenView
      actionButton={actionButton}
      title={title}
      hasBackButton={hasBackButton}
      onBackPress={onBackPress}
    >
      {component}
    </ScreenView>
  );
};
