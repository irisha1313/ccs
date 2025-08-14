import React from 'react';
import { Modal, Text, View } from 'react-native';
import { Button } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';

import { useIsOnline } from '../../context/netStateContext';
import appStyles from '../../theme/appStyles';
import { Colors, Fonts } from '../../constants';
import { Screens as SafeClearScreens } from '../../constants/SafeClear';
import { Logo } from '../../components';

const getActiveRouteState = function (route) {
  if (
    !route.routes ||
    route.routes.length === 0 ||
    route.index >= route.routes.length
  ) {
    return route;
  }

  const childActiveRoute = route.routes[route.index];
  return getActiveRouteState(childActiveRoute);
};

const OfflineIntro = () => {
  const dispatch = useDispatch();
  const isOnline = useIsOnline();
  const navState = useSelector((state) => state.nav);
  const user = useSelector((state) => state.auth.user);

  const usersWithSelfAccessToSafeClear = [
    'hflans@gmail.com',
    'travis.ford@railpros.com',
    'brian.mazur@railpros.com',
    'robert.grapes@railpros.com',
    'michael.grether@railpros.com',
  ];

  const isAbleToAccessSafeClearAsFlagman =
    usersWithSelfAccessToSafeClear.includes(user?.email?.toLowerCase());

  const modalIsVisible =
    isAbleToAccessSafeClearAsFlagman &&
    !isOnline &&
    ![
      'NoInternet',
      'SafeClearHomeScreen',
      'SafeClearCreateLogScreen',
      'SafeClearActiveLogScreen',
      'SafeClearCreateUserScreen',
      'SafeClearSubmittedLogScreen',
      'SafeClearSubmittedUserStatusScreen',
      'SafeClearEntryNotesScreen',
    ].includes(getActiveRouteState(navState)?.routeName);

  const handleOfflineMode = () =>
    dispatch(
      NavigationActions.navigate({
        routeName: SafeClearScreens.Home.route,
        params: { userData: user },
      })
    );

  return (
    <Modal animationType="slide" transparent={false} visible={modalIsVisible}>
      <Logo style={{ height: 68, width: 220 }} />
      <Text
        style={{
          textAlign: 'center',
          fontSize: Fonts.size.xxbig,
          fontWeight: 'bold',
          marginTop: 20,
        }}
      >
        Connection Lost
      </Text>
      <Text
        style={{
          fontSize: Fonts.size.normal,
          marginTop: 20,
          marginLeft: 25,
        }}
      >
        It looks like your network connection isn't currently working.
      </Text>
      <Text
        style={{
          fontSize: Fonts.size.normal,
          marginTop: 10,
          marginLeft: 25,
        }}
      >
        You can still go offline and make changes to your SafeClear logs.
      </Text>
      <View style={{ alignItems: 'center', top: 40, flex: 1 }}>
        <View
          style={{
            flexDirection: 'column',
            marginTop: 80,
          }}
        >
          <View style={{ width: 180, marginRight: 16 }}>
            <Button
              full
              primary
              style={appStyles.btnSecontary}
              onPress={handleOfflineMode}
            >
              <Text style={{ color: Colors.white, paddingHorizontal: 16 }}>
                Offline Mode
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OfflineIntro;
