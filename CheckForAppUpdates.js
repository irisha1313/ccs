import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { Alert } from 'react-native';

/**
 * Manually check for app updates and prompt user to reload the app if there is a new update available.
 * Runs only once on app load.
 */
const CheckForAppUpdates = () => {
  useEffect(() => {
    (async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            'New Update Available',
            'There is newer version of app available. Update now?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              { text: 'Update', onPress: () => Updates.reloadAsync() },
            ]
          );
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return null;
};

export default CheckForAppUpdates;
