import React, { useState } from "react";
import { View, Linking, Switch, StyleSheet } from "react-native";
import { Spinner } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { connect, useDispatch } from "react-redux";
import _ from "lodash";
import { NavigationActions } from "react-navigation";

import {
  navigateToCoords,
  verifyLocationPermissions,
} from "../sharedMethods/location";
import { Colors, Fonts, Icons } from "../constants";

import { FsText, FsButton, FsAlert } from "./CustomComponents";
import FlagIcon from "./FlagIcon";
import { getFlagType } from "../sharedMethods/flags";
import { tracksByOrgId } from "../containers/CreateFormBScreen/staticData";
// QR_CODE
// import ConfirmFlagByQrCode from './ConfirmFlagByQrCode';
import { USER_ROLES } from "../utils/userRoles";

/**
 * @prop onPress
 * @prop flag
 *
 */
const FlagEntry = (props) => {
  const {
    flag,
    canEdit,
    onPress,
    handleFlagToggling,
    showDirections = true,
    additionalIcon = null,
    isArchived,
    currentOrganization,
    user,
  } = props;
  const { isDerail, isFormB, isSwitchLocks } = getFlagType(flag);

  const [loading, setLoading] = useState(false);
  // QR-CODE
  // const [scanning, setScanning] = useState(false);
  const dispatch = useDispatch();

  const isUP =
    currentOrganization.id === 6 ||
    currentOrganization.id === 8 ||
    currentOrganization.id === 9;

  const tracksForOrg = tracksByOrgId[isUP ? 6 : currentOrganization.id] || [];

  const orgSupportsTracks = Boolean(tracksForOrg.length);

  const handleToggle = async () => {
    const title = flag.is_established
      ? `${isDerail
        ? "Turn Derail Off"
        : isFormB
          ? "Close Flag"
          : "Turn Switch Off"
      }`
      : `${_.isNil(flag.established_gps_lat)
        ? `Set ${isFormB ? "Flag" : isDerail ? "Derail" : "Switch"}`
        : isDerail
          ? "Turn Derail On"
          : isFormB
            ? "Open Flag"
            : "Turn Switch On"
      }`;
    const description = _.isNil(flag.established_gps_lat)
      ? `You are about to set this ${isDerail ? "derail's" : isFormB ? "flag's" : "switch's"
      } location. This cannot be changed. Are you sure?`
      : `Are you sure that you want to ${flag.is_established ? "close" : "open"
      } this ${isDerail ? "derail" : isFormB ? "flag" : "switch"}?`;
    try {
      await FsAlert.alertYesCancel(title, description, "Yes", "No");
    } catch (error) {
      setLoading(false);
      return;
    }

    // Request confirmation by QR code only if the flag has "item_qr" value
    // const isFlagmen = user?.role_id === USER_ROLES.Flagmen
    // QR-CODE
    // if (!_.isNil(flag.established_gps_lat) && flag.item_qr && isFlagmen) {
    //   setScanning(true);
    // } else {
    //   await doActualToggle();
    // }
    await doActualToggle();
  };

  const doActualToggle = async () => {
    setLoading(true);

    if (_.isNil(flag.established_gps_lat)) {
      dispatch(
        NavigationActions.navigate({
          routeName: "EstablishFlagMapScreen",
          params: { flag },
        })
      );
    } else {
      const locationGranted = await verifyLocationPermissions(
        Linking,
        props.navigation
      );
      if (locationGranted) {
        await handleFlagToggling();
      }
    }
    setLoading(false);
  };

  // QR-CODE
  // const handleConfirmByQRCode = async (flagIdFromQrCode) => {
  //   setScanning(false);
  //   if (flag.item_qr && Number(flagIdFromQrCode) !== Number(flag.item_qr)) {
  //     FsAlert.alertOk(
  //       "Invalid Flag",
  //       "The QR code you scanned does not match the flag you are trying to open/close."
  //     );
  //     return;
  //   }

  //   requestAnimationFrame(() => {
  //     doActualToggle()
  //   });
  // };

  onPressDirections = async () => navigateToCoords(flag);

  if (loading)
    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner color={Colors.secondary} />
      </View>
    );

  return (
    <View
      style={[
        { flexDirection: "row", alignItems: "center" },
        { minHeight: 64 },
      ]}
    >
      {/* QR-CODE {scanning && (
        <ConfirmFlagByQrCode
          onConfirm={handleConfirmByQRCode}
          onCancel={() => setScanning(false)}
        />
      )} */}
      <FsButton
        style={[{ flexDirection: "row", alignItems: "center" }, { flex: 1 }]}
        onPress={() => !isArchived && onPress && onPress()}
      >
        <FlagIcon
          {...{ isDerail, isFormB, isSwitchLocks }}
          flagType={flag.type}
        />

        <View style={[{ flex: 1 }, { marginHorizontal: 12 }]}>
          <FsText>
            {isSwitchLocks
              ? `${flag.mile_post} - ${flag.serial_number}`
              : isFormB || (isDerail && flag.type === "red")
                ? `MP ${flag.mile_post} ${!_.isNil(flag.serial_number) ? `- ${flag.serial_number}` : ""
                }`
                : `SN ${flag.serial_number}`}
            {orgSupportsTracks && flag.track !== "Other"
              ? `- ${flag.track}`
              : ""}
          </FsText>
          <FsText
            style={[
              { marginTop: 1 },
              { fontSize: Fonts.size.xxsmall },
              {
                color: flag.is_established ? Colors.red : Colors.textSecondary,
              },
              { fontWeight: flag.is_established ? "bold" : "normal" },
            ]}
          >
            {flag.is_established ? "Open" : "Closed"}
          </FsText>
        </View>
      </FsButton>
      {additionalIcon}
      {flag.established_gps_lat && showDirections ? (
        <FsButton
          onPress={onPressDirections}
          style={[{ paddingVertical: 16 }, { paddingHorizontal: 24 }]}
        >
          <MaterialIcons
            name={"directions"}
            color={Colors.primary}
            size={Icons.size.normal + 2}
          />
        </FsButton>
      ) : null}

      {!isArchived && canEdit && _.isNil(flag.established_gps_lat) ? (
        <FsButton
          onPress={handleToggle}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 10,
            marginRight: 7,
            marginLeft: 7,
            backgroundColor: Colors.secondarySharp,
            borderRadius: 10,
          }}
        >
          <FsText
            style={{
              color: Colors.primary,
              fontSize: 13,
              padding: 0,
              textAlign: "center",
              minWidth: 45,
              color: "white",
            }}
          >
            SET
          </FsText>
        </FsButton>
      ) : !isArchived && canEdit && !_.isNil(flag.established_gps_lat) ? (
        <Switch
          style={{
            marginRight: 14,
          }}
          trackColor={{ false: Colors.grey, true: Colors.secondarySharpDark }}
          thumbColor="white"
          ios_backgroundColor={
            flag.is_established ? Colors.secondarySharpDark : Colors.grey
          }
          onValueChange={handleToggle}
          value={Boolean(flag.is_established)}
        />
      ) : null}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    currentOrganization: state.organizations.currentOrganization,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(FlagEntry);
