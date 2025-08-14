import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import { App } from '../store/store';

const ReduxNavigation = () => {
  const { state } = useSelector((state) => ({
    state,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  const onBackPress = () => {
    dispatch(NavigationActions.back());
    return true;
  };

  return <App state={state.nav} dispatch={dispatch} />;
};

export default ReduxNavigation;
