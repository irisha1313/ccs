import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';
import moment from 'moment-timezone';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { Spinner, Button } from 'native-base';
import omit from 'lodash/omit';

import { Colors, Fonts, Icons, Styles } from '../../constants';
import { Formats, Entry } from '../../constants/SafeClear';
import { FsText, FsAlert } from '../CustomComponents';
import { createEntry } from '../../actions/SafeClear/currentLog';

const defaultEntry = {
  type: '',
  direction_traveling: '',
  identifier: '',
  track: '',
  in_time: '',
  restriction: '',
};

const LandscapeLogEntry = (props) => {
  const dispatch = useDispatch();

  const [newEntry, setNewEntry] = useState(defaultEntry);
  const [creatingEntry, setCreatingEntry] = useState(false);
  const [submittingEntry, setSubmittingEntry] = useState(false);

  const { signedIn } = useSelector((state) => ({
    signedIn: state.safeClear.currentLog.data.signedIn,
  }));

  useEffect(() => {
    if (signedIn?.length && newEntry.in_time) {
      FsAlert.alertOk(
        'Warning',
        "In Time has been reset for the entry you are currently creating. Please make sure to sign out or except everybody out before attempting to set that entry's In Time again."
      );

      setNewEntry({
        ...newEntry,
        in_time: '',
      });
    }
  }, [signedIn]);

  const { entry, submitted, isNewEntry, logId, usersSignedIn } = props;

  const {
    id,
    direction_traveling,
    identifier,
    track,
    in_time,
    restriction,
    type,
    notes,
  } = entry || {};

  const isNewEntryDisabled = isNewEntry && !creatingEntry;

  let alternativeIdentifierTextSize;

  if (typeof identifier === 'string') {
    if (identifier.length > 11) {
      alternativeIdentifierTextSize = styles.extraSmallText;
    } else if (identifier.length > 7) {
      alternativeIdentifierTextSize = styles.smallText;
    }
  }

  const PreviewEntry = () => (
    <>
      <FsText
        style={[styles.column, isNewEntryDisabled && styles.disabledText]}
      >
        {type || (isNewEntryDisabled ? 'Type' : '')}
      </FsText>
      <FsText
        style={[
          styles.column,
          alternativeIdentifierTextSize,
          isNewEntryDisabled && styles.disabledText,
        ]}
      >
        {identifier || (isNewEntryDisabled ? 'Identifier' : '')}
      </FsText>
      <FsText
        style={[styles.column, isNewEntryDisabled && styles.disabledText]}
      >
        {track || (isNewEntryDisabled ? 'Track' : '')}
      </FsText>
      <FsText
        style={[
          styles.column,
          { flex: 2.5 },
          isNewEntryDisabled && styles.disabledText,
        ]}
      >
        {restriction ? restriction : isNewEntryDisabled ? 'Restriction' : ''}
      </FsText>
      <FsText
        style={[
          styles.column,
          isNewEntryDisabled && styles.disabledText,
          { flex: 4.5 },
        ]}
      >
        {direction_traveling ||
          (isNewEntryDisabled ? 'Direction Traveling' : '')}
      </FsText>
      <FsText
        style={[
          styles.column,
          { color: Colors.secondarySharpDark },
          isNewEntryDisabled && styles.disabledText,
        ]}
      >
        {in_time
          ? moment(in_time, 'HH:mm:ss').format(Formats.displayHourFormat)
          : isNewEntryDisabled
          ? 'In'
          : ''}
      </FsText>
      <Ionicons
        disabled={isNewEntryDisabled}
        name="ios-newspaper-outline"
        size={Icons.size.normal}
        color={Colors.secondarySharp}
        style={[
          styles.column,
          isNewEntryDisabled && styles.disabledText,
          { flex: 1.5 },
        ]}
        onPress={() =>
          !isNewEntryDisabled &&
          dispatch(
            NavigationActions.navigate({
              routeName: 'SafeClearEntryNotesScreen',
              params: {
                entryId: id,
                notes,
                submitted,
              },
            })
          )
        }
      />
    </>
  );

  const onChange = (newValue, entryAttribute) =>
    setNewEntry({ ...newEntry, [entryAttribute]: newValue });

  const handleEntryCreation = async (inTime) => {
    const newEntryWithInTime = {
      ...newEntry,
      in_time: inTime,
    };
    const entryDataMissing = Object.values(
      omit(newEntryWithInTime, 'restriction')
    ).some((value) => !value);

    if (entryDataMissing) {
      return FsAlert.alertOk(
        'Error',
        "Please make sure to fill in all of this entry's data."
      );
    }

    if (usersSignedIn) {
      return FsAlert.alertOk(
        'Warning',
        'You still have signed in users. Please make sure to sign out or except everybody out before attempting to add a new entry.'
      );
    }

    try {
      await FsAlert.alertYesCancel(
        'Submit Entry',
        `Are you sure you want to submit this ${newEntryWithInTime.type} entry?`
      );
      setSubmittingEntry(true);
      await dispatch(createEntry({ entry: newEntryWithInTime, logId }));
      setSubmittingEntry(false);
      setCreatingEntry(false);
      setNewEntry(defaultEntry);
    } catch (error) {}
  };

  const RenderEditEntry = () => {
    const handlein_timeUpdate = async () => {
      if (signedIn.length) {
        return FsAlert.alertOk(
          'Unable to set In Time',
          "Please make sure to sign out or except everybody out before attempting to set this entry's In Time."
        );
      } else if (newEntry.in_time) {
        try {
          await FsAlert.alertYesCancel(
            'Update In Time',
            `Are you sure you want to update this entry's In Time?`
          );
        } catch (e) {}
      }

      const newTimeValue = moment().seconds(0).milliseconds(0).format('HH:mm');

      handleEntryCreation(newTimeValue);
    };
    return (
      <>
        <View style={styles.column}>
          <Dropdown
            value={newEntry.type}
            data={Entry.types}
            onChangeText={(newValue) => onChange(newValue, 'type')}
            style={styles.dropdown}
            fontSize={Fonts.size.big}
            containerStyle={styles.dropdownContainer}
            inputContainerStyle={styles.dropdownInputContainer}
            textAlign="center"
          />
        </View>
        <View style={styles.column}>
          <TextInput
            value={newEntry.identifier}
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: Fonts.size.big,
            }}
            onChangeText={(newValue) => onChange(newValue, 'identifier')}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="next"
          />
        </View>
        <View style={styles.column}>
          <Dropdown
            value={newEntry.track}
            data={Entry.tracks}
            onChangeText={(newValue) => onChange(newValue, 'track')}
            style={styles.dropdown}
            fontSize={Fonts.size.big}
            containerStyle={styles.dropdownContainer}
            inputContainerStyle={styles.dropdownInputContainer}
            textAlign="center"
          />
        </View>
        <View style={[styles.column, { flex: 2.5 }]}>
          <TextInput
            value={newEntry.restriction}
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: Fonts.size.big,
            }}
            onChangeText={(newValue) => onChange(newValue, 'restriction')}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="next"
          />
        </View>
        <View style={[styles.column, { flex: 4.5 }]}>
          <Dropdown
            value={newEntry.direction_traveling}
            data={Entry.directionTravelingOption}
            onChangeText={(newValue) =>
              onChange(newValue, 'direction_traveling')
            }
            style={styles.dropdown}
            fontSize={Fonts.size.big}
            containerStyle={styles.dropdownContainer}
            inputContainerStyle={styles.dropdownInputContainer}
            textAlign="center"
          />
        </View>
        <View style={styles.column}>
          <Button
            onPress={handlein_timeUpdate}
            style={{ backgroundColor: 'transparent' }}
          >
            <FsText
              style={{
                fontSize: Fonts.size.big,
                color: newEntry.in_time
                  ? Colors.secondarySharpDark
                  : Colors.primaryDark,
                textDecorationLine: 'underline',
              }}
            >
              {newEntry.in_time || 'Set'}
            </FsText>
          </Button>
        </View>
        <Ionicons
          name="ios-newspaper-outline"
          size={Icons.size.normal}
          color={Colors.grey}
          style={[styles.column, { flex: 1.5 }]}
        />
      </>
    );
  };

  return (
    <View
      style={[
        styles.container,
        isNewEntryDisabled && {
          backgroundColor: Colors.borderLightGrey,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          borderRadius: 10,
          marginVertical: 5,
        },
      ]}
    >
      <View
        style={[
          styles.column,
          { flex: 1.2, backgroundColor: 'white', height: '100%' },
        ]}
      >
        {isNewEntryDisabled ? (
          <MaterialCommunityIcons
            name="plus-circle"
            size={Icons.size.xxbig}
            color={
              creatingEntry
                ? Colors.secondarySharpDark
                : Colors.secondaryTextGrey
            }
            style={{ margin: 'auto' }}
            onPress={() => {
              setCreatingEntry(true);
            }}
          />
        ) : submittingEntry ? (
          <Spinner color={Colors.secondary} />
        ) : (
          <>
            <Ionicons
              name="lock-closed"
              size={Icons.size.xxbig}
              color={Colors.secondaryTextGrey}
              style={{ marginLeft: 15 }}
            />
            <MaterialCommunityIcons
              name="chevron-right"
              size={Icons.size.xxbig}
              color={Colors.secondarySharp}
              style={{ marginLeft: -8 }}
            />
          </>
        )}
      </View>
      {creatingEntry ? RenderEditEntry() : <PreviewEntry />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 50,
    borderColor: Colors.borderLightGrey,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  column: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: Fonts.size.big,
  },
  disabledText: {
    color: Colors.textGrey,
    fontStyle: 'italic',
  },
  dropdown: {
    fontFamily: Styles.constant.FontFamily,
    color: Colors.black,
    marginTop: 0,
    backgroundColor: 'transparent',
  },
  dropdownContainer: {
    top: -3,
    width: '100%',
    justifyContent: 'center',
  },
  dropdownInputContainer: { borderBottomWidth: 0, paddingLeft: 15 },
  normalText: {
    fontSize: Fonts.size.normal,
  },
  smallText: {
    fontSize: Fonts.size.small,
  },
  extraSmallText: {
    fontSize: Fonts.size.xsmall,
  },
});

export default LandscapeLogEntry;
