import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';

import { FsButtonActionIcon } from '../../components/CustomComponents';
import { Icons } from '../../constants';

const clientId = '01c2acce-695d-4431-a09d-c39213f68b40';

WebBrowser.maybeCompleteAuthSession();

export default ({ style, onSSOLogin }) => {
  const dispatch = useDispatch();

  const redirectUri = Platform.select({
    // ios: 'exp://exp.host/@clsmith/flagsmith', // local
    // ios: 'exp://exp.host/@clsmith/railprosotss-staging', // local - staging
    ios: 'com.railpros.railprosotss://login',
    android: `${makeRedirectUri()}login`,
  });

  const discovery = useAutoDiscovery(
    'https://login.microsoftonline.com/5384b56e-74f5-4534-b967-074c24d7d2f6/v2.0'
  );
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes: [
        'openid',
        'email',
        'profile',
        'api://01c2acce-695d-4431-a09d-c39213f68b40/OTSSAUTH01',
      ],
      responseType: ResponseType.Code,
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      exchangeCodeAsync(
        {
          clientId,
          redirectUri,
          code: response.params.code,
          extraParams: {
            code_verifier: request?.codeVerifier || '',
          },
        },
        discovery
      ).then(({ accessToken }) => onSSOLogin(accessToken, dispatch));
    }
  }, [response]);

  return (
    <FsButtonActionIcon
      title={'Login with Microsoft'}
      onPress={() => {
        promptAsync();
      }}
      style={style}
      renderIcon={(color) => (
        <FontAwesome5 name="microsoft" color={color} size={Icons.size.normal} />
      )}
    />
  );
};
