import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from '@expo/vector-icons';
import { Spinner } from 'native-base';
import { NavigationActions } from 'react-navigation';
import moment from 'moment-timezone';
import _ from 'lodash';
import haversine from 'haversine';

import { Colors, Fonts, Icons, Styles, GeoLocations } from '../constants';
import { deleteFormB, stopEarlyCancel } from '../actions/formbs';
import {
  FsAlert,
  FsText,
  FsButton,
  FsButtonActionIcon,
} from './CustomComponents';
import FlagEntry from './FlagEntry';
import OpenCloseTimeView from './OpenCloseTimeView';
import { getCurrentPosition } from '../sharedMethods/location';
import {
  formBIsActive,
  timeUntilFormbOpening,
  getFlagType,
} from '../sharedMethods/flags';
import { toggleFlagEstablishment } from '../actions/flags';
import { USER_ROLES } from '../utils/userRoles';

const FormBEntry = (props) => {
  const dispatch = useDispatch();
  const { userData, currentOrganization } = useSelector((state) => ({
    userData: state.auth.user,
    currentOrganization: state.organizations.currentOrganization,
  }));

  const {
    formB,
    flags,
    hiddenOptions = [],
    hideFlags,
    isArchived,
    handleUnarchive,
    currentUserData,
  } = props;
  if (_.isNil(formB)) {
    return null;
  }

  const [loading, setLoading] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [displayFlags, setDisplayFlags] = useState(
    formB.isActive || formB.openFlags
  );

  const openRedFlag = flags
    ? flags.find((flag) => flag.type === 'red' && flag.is_established)
    : 0;

  const defaultFlagsByType = { flags: [], derails: [], switchLocks: [] };

  const flagsByType = flags
    ? flags.reduce((groupedItems, currentFlag) => {
        const { isFormB, isDerail } = getFlagType(currentFlag);
        if (isFormB) {
          return {
            ...groupedItems,
            flags: [...groupedItems.flags, currentFlag],
          };
        } else if (isDerail) {
          return {
            ...groupedItems,
            derails: [...groupedItems.derails, currentFlag],
          };
        }

        return {
          ...groupedItems,
          switchLocks: [...groupedItems.switchLocks, currentFlag],
        };
      }, defaultFlagsByType)
    : defaultFlagsByType;

  const FormBButtonStyle = [
    { padding: 0 },
    { width: 40 },
    { height: 40 },
    { justifyContent: 'center' },
    { alignItems: 'center' },
    { borderRadius: Styles.constant.BorderRadius },
  ];
  const FormBButtonIconSize = Icons.size.xbig;

  const onChangeScreen = (routeName) => () => {
    dispatch(
      NavigationActions.navigate({
        routeName,
        params: { formB, flags, currentUserId: currentUserData.id },
      })
    );
  };

  const onPressDelete = () => () => {
    const openFlags =
      (flags && flags.filter((flag) => flag.is_established)) || [];
    if (openFlags.length > 0) {
      return FsAlert.alertOk(
        `Active ${currentOrganization.settings.form_verbiage}`,
        `Please close all your flags before deleting this ${currentOrganization.settings.form_verbiage}`
      );
    }
    return FsAlert.alertYesCancel(
      `Delete ${currentOrganization.settings.form_verbiage}`,
      `Are you sure that you want to delete this ${currentOrganization.settings.form_verbiage}?`,
      'Yes',
      'No'
    )
      .then(() => {
        setLoading(true);
        dispatch(deleteFormB(formB.id, currentOrganization.settings.id));
      })
      .catch(() => {});
  };

  const canEdit = () => {
    const { role_id, id } = userData;
    const { created_by } = formB;

    if (role_id === USER_ROLES.Flagmen) {
      if (created_by === id) {
        return true;
      }
      return false;
    }
    return true;
  };

  const onFlagPress = async (flag) => {
    dispatch(
      NavigationActions.navigate({
        routeName: 'FlagDetailsScreen',
        params: { formB, currentFlag: flag, flags },
      })
    );
  };

  const handleFlagToggling = async (flag) => {
    const currentPosition = await getCurrentPosition();
    const userCoords = {
      latitude: currentPosition.coords.latitude,
      longitude: currentPosition.coords.longitude,
    };
    const flagCoords = {
      latitude: flag.established_gps_lat,
      longitude: flag.established_gps_long,
    };
    const distanceBetweenUserAndFlag = haversine(userCoords, flagCoords, {
      unit: 'mile',
    });
    const isFormbActive = formBIsActive(formB);

    const timeForOpening = timeUntilFormbOpening(formB);
    const has24HoursTagAndIsBeingClosed =
      formB.tags && formB.tags.length > 0
        ? formB.tags.map(({ name }) => name).includes('24 hours') &&
          flag.is_established
        : false;
    const numberOfOpenFlags = flags.filter(
      (flag) => flag.is_established
    ).length;
    if (!isFormbActive && !flag.is_established) {
      FsAlert.alertOk(
        `Inactive ${currentOrganization.settings.form_verbiage}`,
        `Please check your active days of the week. You cannot open a flag on an inactive day. Edit your ${currentOrganization.settings.form_verbiage} and try again.`
      );
    } else if (
      distanceBetweenUserAndFlag > GeoLocations.MAX_DISTANCE_THRESHOLD &&
      userData.role_id === USER_ROLES.Flagmen &&
      !has24HoursTagAndIsBeingClosed // FLAG-366
    ) {
      try {
        await FsAlert.alertOptions(
          `Too Far Away`,
          `You have to be within ${
            GeoLocations.MAX_DISTANCE_THRESHOLD
          } miles of your flag and you are ${distanceBetweenUserAndFlag.toFixed(
            2
          )} miles away. Press continue to manually update your location.`,
          ['Continue']
        );
        return await dispatch(
          NavigationActions.navigate({
            routeName: 'FlagLocationVerificationScreen',
            params: { flag, flags },
          })
        );
      } catch (error) {}
    } else if (
      !flag.is_established &&
      flag.type === 'red' &&
      !_.isNil(timeForOpening) &&
      timeForOpening !== 0 &&
      userData.role_id === USER_ROLES.Flagmen &&
      currentOrganization.settings.id !== 7 && // FLAG-349
      currentOrganization.settings.id !== 10 && // FLAG-341
      currentOrganization.settings.id !== 12 // Chad request on July 23rd
    ) {
      FsAlert.alertOk(
        `Your ${currentOrganization.settings.form_verbiage} is not yet active`,
        `Please wait ${timeForOpening} before opening a red flag.`
      );
    } else if (
      flag.is_established &&
      flag.type === 'yellow-red' &&
      flag.paired &&
      flag.paired.find(
        (pairedFlag) => pairedFlag.type === 'red' && pairedFlag.is_established
      )
    ) {
      FsAlert.alertOk(
        'Paired Red Flag Still Open',
        'Please make sure you close all of the red flags associated to this one before trying to close it..'
      );
    } else if (
      !flag.is_established &&
      flag.type === 'red' &&
      flag.paired &&
      flag.paired.find(
        (pairedFlag) =>
          pairedFlag.type === 'yellow-red' && !pairedFlag.is_established
      )
    ) {
      FsAlert.alertOk(
        'Paired Flags Inactive',
        'Please make sure all your paired yellow-red are open before opening this flag.'
      );
    } else if (
      !flag.is_established &&
      flag.type === 'red' &&
      flag.paired &&
      flag.paired.find(
        (pairedFlag) =>
          (pairedFlag.type === 'lh' && !pairedFlag.is_established) ||
          (pairedFlag.type === 'rh' && !pairedFlag.is_established)
      )
    ) {
      FsAlert.alertOk(
        'Paired Flags Inactive',
        'Please make sure all your paired derails are open before opening this flag.'
      );
    } else if (
      flag.is_established &&
      numberOfOpenFlags === 1 &&
      currentOrganization.settings.debrief_with_dispatch
    ) {
      try {
        await FsAlert.alertYesCancel(
          'Methods Removal Verification',
          `Have all applicable methods of protection (flags, derails, lock switches) been removed from the property and all persons and equipment clear for the night?`,
          'Yes',
          'No'
        );
        return await dispatch(
          toggleFlagEstablishment(
            flag,
            userData.id,
            currentOrganization.settings.id
          )
        );
      } catch (err) {}
    } else {
      return await dispatch(
        toggleFlagEstablishment(
          flag,
          userData.id,
          currentOrganization.settings.id
        )
      );
    }
  };

  const ActionButtons = () => {
    if (isArchived)
      return (
        <>
          <FsButton
            onPress={() => {
              if (handleUnarchive) {
                handleUnarchive(formB);
              }
            }}
            style={FormBButtonStyle}
          >
            <MaterialIcons
              name="unarchive"
              color={Colors.textLight}
              size={FormBButtonIconSize}
            />
          </FsButton>
          <FsButton
            onPress={() =>
              dispatch(
                NavigationActions.navigate({
                  routeName: 'FormBsOwnershipTransferScreen',
                  params: { formB },
                })
              )
            }
            style={FormBButtonStyle}
          >
            <MaterialCommunityIcons
              name="transfer-right"
              color={Colors.textLight}
              size={FormBButtonIconSize}
            />
          </FsButton>
        </>
      );

    const shouldDisableOptions = !formB || !flags || !userData;

    return (
      <>
        {canEdit() && !hiddenOptions.includes('jobBriefing') ? (
          <FsButton
            onPress={onChangeScreen('CreateJobBriefingScreen')}
            style={[FormBButtonStyle]}
            disabled={shouldDisableOptions}
          >
            <MaterialIcons
              name="record-voice-over"
              color={Colors.textLight}
              size={FormBButtonIconSize}
            />
          </FsButton>
        ) : null}
        {canEdit() && !hiddenOptions.includes('edit') ? (
          <FsButton
            onPress={onChangeScreen('CreateFormBScreen')}
            style={[FormBButtonStyle]}
            disabled={shouldDisableOptions}
          >
            <MaterialIcons
              name="edit"
              color={Colors.textLight}
              size={FormBButtonIconSize}
            />
          </FsButton>
        ) : null}
        {!_.isNil(onPressDelete) &&
        canEdit() &&
        !hiddenOptions.includes('delete') ? (
          <FsButton
            onPress={onPressDelete()}
            style={[FormBButtonStyle]}
            disabled={shouldDisableOptions}
          >
            <MaterialCommunityIcons
              name="delete-outline"
              color={Colors.textLight}
              size={27}
              style={{ top: 0 }}
            />
          </FsButton>
        ) : null}
        {!hiddenOptions.includes('incidentReport') ? (
          <FsButton
            onPress={onChangeScreen('IncidentReportScreen')}
            style={[FormBButtonStyle]}
            disabled={shouldDisableOptions}
          >
            <MaterialIcons
              name="note-add"
              color={Colors.textLight}
              size={FormBButtonIconSize}
              style={{ top: 0 }}
            />
          </FsButton>
        ) : null}
        {!hiddenOptions.includes('flagsLocation') ? (
          <FsButton
            onPress={onChangeScreen('FlagMapScreen')}
            style={[FormBButtonStyle]}
            disabled={shouldDisableOptions}
          >
            <MaterialIcons
              name="location-on"
              color={Colors.textLight}
              size={FormBButtonIconSize}
            />
          </FsButton>
        ) : null}
      </>
    );
  };

  const contextMenuOptions = [
    {
      name: 'Transfer',
      icon: 'transfer-right',
      onClick: () =>
        dispatch(
          NavigationActions.navigate({
            routeName: 'FormBsOwnershipTransferScreen',
            params: { formB, isUnarchived: true },
          })
        ),
    },
  ];

  const buildActiveDaysArray = () => {
    const currentTime = moment().startOf('day');
    return formB?.activeDates
      ?.filter(({ date }) => currentTime.isSameOrBefore(date))
      .map(({ date }) => moment(date).format('MM/DD'))
      .sort() || [];
  };

  const daysArray = buildActiveDaysArray();
  const firstFourActiveDays = daysArray.slice(0, 4);
  const lastThreeActiveDays = daysArray.slice(4, 7);

  const protectionSetToExpireEarly =
    formB && formB.expires_at && formB.timezone;
  const protectionWillExpireWithOpenFlags = formB.willExpireIn20 && openRedFlag;

  const Entry = (
    <React.Fragment>
      {contextMenuOpen ? (
        <FlatList
          data={contextMenuOptions}
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: Colors.divider,
            position: 'absolute',
            alignItems: 'center',
            alignSelf: 'center',
            top: 85,
            zIndex: 10,
            width: 120,
            borderRadius: 5,
          }}
          listKey={moment().valueOf().toString()}
          keyExtractor={() => Math.random().toString(36).slice(-5)}
          renderItem={({ item: { name, icon, onClick } }) => {
            return (
              <FsButton
                style={{
                  width: '100%',
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                  borderColor: 'transparent',
                }}
                onPress={() => {
                  if (onClick) {
                    onClick();
                  }
                  setContextMenuOpen(false);
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 34,
                  }}
                >
                  <FsText>{name}</FsText>
                  {icon ? (
                    <MaterialCommunityIcons
                      style={{ marginLeft: 3, marginTop: 2 }}
                      name={icon}
                      size={15}
                      color="black"
                    />
                  ) : null}
                </View>
              </FsButton>
            );
          }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: Colors.divider,
              }}
            ></View>
          )}
        />
      ) : null}
      <View
        style={[
          { backgroundColor: Colors.secondary },
          {
            borderTopLeftRadius: Styles.constant.BorderRadius,
            borderTopRightRadius: Styles.constant.BorderRadius,
          },
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
          props.headerContainerStyle,
        ]}
      >
        {canEdit() && !isArchived ? (
          <FsButtonActionIcon
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              minWidth: 5,
              paddingHorizontal: 0,
              borderColor: 'transparent',
              backgroundColor: 'transparent',
              color: 'white',
            }}
            onPress={() => setContextMenuOpen(!contextMenuOpen)}
            renderIcon={() =>
              contextMenuOpen ? (
                <FontAwesome
                  name="close"
                  size={Icons.size.normal}
                  color="white"
                />
              ) : (
                <MaterialIcons
                  name="menu"
                  size={Icons.size.normal}
                  color="white"
                />
              )
            }
          ></FsButtonActionIcon>
        ) : null}
        <View
          style={{
            flex: 6,
            flexDirection: 'column',
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <FsText
            style={{
              flex: 1,
              color: Colors.textLight,
              fontSize: 18,
              fontWeight: 'bold',
            }}
            numberOfLines={2}
          >
            {formB.subdivision} Sub
          </FsText>
          <FsText style={{ fontSize: 14, color: '#bac1d3' }}>
            {`${formB.city}, ${formB.state}`}
          </FsText>
          <FsText
            style={{
              marginTop: 4,
              fontSize: Fonts.size.xxxsmall,
              color: '#c3cad8',
            }}
          >
            Job Number:{' '}
            {!_.isNil(formB.job_number) &&
            String(formB.job_number).trim() !== ''
              ? formB.job_number
              : 'N/A'}
          </FsText>
          <FsText
            style={{
              marginTop: 4,
              fontSize: Fonts.size.xxxsmall,
              color: '#c3cad8',
            }}
          >
            Job Site Mile Post:{' '}
            {!_.isNil(formB.job_site_mile_post) &&
            String(formB.job_site_mile_post).trim() !== ''
              ? formB.job_site_mile_post
              : 'N/A'}
          </FsText>
          <FsText
            style={[
              { marginTop: 4 },
              { fontSize: Fonts.size.xxxsmall },
              { color: '#c3cad8' },
            ]}
          >
            Id: {formB.id}
          </FsText>
        </View>
        <View
          style={{
            flexDirection: 'column',
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <OpenCloseTimeView
            formB={formB}
            textStyle={[
              { fontSize: Fonts.size.normal },
              { color: Colors.textLight },
              { fontWeight: 'bold' },
            ]}
            color={Colors.textLight}
          />
          {!_.isNil(formB) && firstFourActiveDays.length ? (
            <>
              <FsText
                style={{
                  marginTop: 3,
                  fontSize: 10,
                  color: Colors.textLight,
                  textDecorationLine: 'underline',
                  textAlign: 'right',
                }}
              >
                Outlook
              </FsText>
              <FsText
                style={{
                  marginTop: 3,
                  fontSize: 10,
                  color: Colors.textLight,
                  textAlign: 'right',
                }}
              >
                {`${firstFourActiveDays.join(', ')}\n`}
                {lastThreeActiveDays.length
                  ? lastThreeActiveDays.join(', ')
                  : null}
              </FsText>
            </>
          ) : null}
          {formB.tags && formB.tags.length > 0 ? (
            <FsText
              style={{
                marginTop: 3,
                fontSize: 10,
                color: Colors.textLight,
                textAlign: 'right',
              }}
            >
              Tags: {formB.tags.map(({ name }) => name).join(', ')}
            </FsText>
          ) : null}
        </View>
      </View>
      <View
        style={{
          borderBottomLeftRadius: 35,
          borderBottomRightRadius: 35,
          marginBottom: 20,
          backgroundColor: protectionSetToExpireEarly
            ? Colors.redDark
            : protectionWillExpireWithOpenFlags
            ? '#ff9345'
            : 'white',
        }}
      >
        <View
          style={{
            backgroundColor: '#3b589e',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            borderBottomLeftRadius: 35,
            borderBottomRightRadius: 35,
          }}
        >
          <ActionButtons />
        </View>
        {!!protectionSetToExpireEarly && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              minHeight: 34,
            }}
          >
            <FsButton
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                backgroundColor: Colors.redDark,
                paddingRight: 25,
                borderRadius: 10,
              }}
              onPress={async () => {
                try {
                  await FsAlert.alertYesCancel(
                    'Stop Early Cancel',
                    'Do you want to stop the Early Cancel process?',
                    'Yes',
                    'No'
                  );

                  const formattedOriginalCloseTime = moment(
                    formB.original_close_time,
                    'HH:mm:ss'
                  ).format('HH:mm');
                  await FsAlert.alertYesCancel(
                    'Stop Early Cancel Confirmation',
                    `Stopping this process will revert the expiration time of this protection back to ${formattedOriginalCloseTime}.`,
                    'Stop Process',
                    'Cancel'
                  );
                  await dispatch(stopEarlyCancel(formB.id));
                } catch (error) {}
              }}
            >
              <MaterialIcons
                name="access-alarms"
                color={Colors.secondarySharpLight}
                size={Icons.size.normal}
              />
              <FsText
                style={{
                  color: 'white',
                  fontSize: Icons.size.xxsmall,
                  textAlign: 'center',
                }}
              >
                Protection expires at{' '}
                {moment(formB.expires_at).tz(formB.timezone).format('HH:mm')}.
                Tap here to stop this early cancel time.
              </FsText>
            </FsButton>
          </View>
        )}
      </View>
      {!_.isNil(flags) && !hideFlags ? (
        displayFlags ? (
          <FlatList
            data={[
              ...flagsByType.flags,
              ...flagsByType.derails,
              ...flagsByType.switchLocks,
            ]}
            listKey={moment().valueOf().toString()}
            keyExtractor={() => Math.random().toString(36).slice(-5)}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            renderItem={(rowData) => {
              const flag = rowData.item;
              const linkedFlags = flag.paired && flag.paired.length > 0;
              return (
                <FlagEntry
                  onPress={() => onFlagPress(flag)}
                  handleFlagToggling={async () =>
                    await handleFlagToggling(flag)
                  }
                  flag={flag}
                  canEdit={canEdit()}
                  isArchived={isArchived}
                  additionalIcon={
                    linkedFlags && (
                      <MaterialIcons
                        name="link"
                        color={Colors.secondarySharpLight}
                        size={Icons.size.xxbig}
                      />
                    )
                  }
                />
              );
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{ borderBottomWidth: 1, borderColor: Colors.divider }}
              ></View>
            )}
            style={[
              {
                backgroundColor: Colors.CardBackground,
                borderWidth: 1,
                borderColor: Colors.divider,
              },
            ]}
          />
        ) : null
      ) : null}
      {flags && !hideFlags && (
        <FsButton
          onPress={() => {
            setDisplayFlags(!displayFlags);
          }}
          style={{
            borderColor: Colors.textGrey,
            borderBottomWidth: !displayFlags ? 1 : 0,
            margin: 0,
            padding: 0,
            paddingTop: 5,
            top: displayFlags ? 0 : -20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <FsText style={{ color: Colors.secondaryTextGrey }}>
            {displayFlags ? 'Hide' : 'Display'} {flags.length}{' '}
            {flags.length > 1 ? 'items' : 'item'}
          </FsText>
          <MaterialIcons
            name={displayFlags ? 'arrow-upward' : 'arrow-downward'}
            color={Colors.secondaryTextGrey}
            size={FormBButtonIconSize}
          />
        </FsButton>
      )}
    </React.Fragment>
  );

  return (
    <View
      style={[{ marginHorizontal: 8 }, { marginTop: 12 }, props.containerStyle]}
    >
      {loading ? <Spinner color={Colors.secondary} /> : Entry}
    </View>
  );
};

export default FormBEntry;
