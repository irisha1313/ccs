import React from "react";
import _ from "lodash";
import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Dropdown } from "react-native-material-dropdown-v2";

import {
  FsText,
  FsButton,
  FsInputWithLabel,
  FsAlert,
} from "./CustomComponents";
import { Colors, Fonts, Icons, Styles } from "../constants";
import { getFlagIcon } from "../sharedMethods/flags";

const FlagCreationEntry = (props) => {
  const { flag, isDerail, isFormB, isSwitchLocks, isActive, tracksForOrg } =
    props;

  const getFlagIconPlaceHolder = () => {
    if (isFormB || (isDerail && flag.type === "red")) {
      return (
        <FontAwesome
          name={"flag"}
          size={Icons.size.normal}
          color={getFlagIcon(flag.type)}
        />
      );
    } else if (isSwitchLocks) {
      return (
        <FontAwesome
          name={"lock"}
          size={Icons.size.normal}
          color={Colors.secondarySharpDark}
        />
      );
    }
    return null; // derails don't require an icon place holder
  };

  const inactiveInputStyle = { backgroundColor: "rgba(201, 201, 201, 0.2)" };
  const labelStyles = { fontSize: 9 };

  // QR-CODE
  // const qrIdInput = (
  //   <FsInputWithLabel
  //     editable={isActive}
  //     inputStyle={!isActive && inactiveInputStyle}
  //     label="QR ID"
  //     labelStyle={labelStyles}
  //     autoCorrect={false}
  //     autoCapitalize="none"
  //     returnKeyType="next"
  //     selectTextOnFocus={true}
  //     containerStyle={{ flex: 2, marginLeft: 12 }}
  //     onChangeText={(text) => {
  //       props.onChangeText("item_qr", Number(text) ?? null);
  //     }}
  //     value={flag.item_qr ? flag.item_qr.toString() : ""}
  //   />
  // );

  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }]}>
      <FsButton
        disabled={!isActive}
        style={[
          { alignItems: "center" },
          { minWidth: 80 },
          { borderWidth: 0.5, borderColor: Colors.divider },
          { borderRadius: Styles.constant.BorderRadius },
        ]}
        onPress={() => props.onPressFlag(flag.type)}
      >
        {getFlagIconPlaceHolder()}
        <FsText
          style={{
            fontSize:
              isDerail && flag.type !== "red"
                ? Fonts.size.big
                : Fonts.size.xxxxsmall,
            fontWeight: isDerail && flag.type !== "red" ? "bold" : "normal",
            color:
              isDerail && flag.type !== "red"
                ? getFlagIcon(flag.type)
                : "black",
            textAlign: "center",
          }}
        >
          {_.toUpper(flag.type)}
        </FsText>
      </FsButton>

      {isSwitchLocks || isFormB || (isDerail && flag.type === "red") ? (
        <>
          <FsInputWithLabel
            editable={isActive}
            label={"MILE POST"}
            labelStyle={labelStyles}
            inputStyle={!isActive && inactiveInputStyle}
            returnKeyType="next"
            autoCorrect={false}
            autoCapitalize="none"
            selectTextOnFocus={true}
            containerStyle={{ flex: 2, marginLeft: 12 }}
            onChangeText={(text) => {
              if (text === ".") {
                props.onChangeText("mile_post", "0.");
              } else if (isNaN(text)) {
                FsAlert.alertOk(
                  "Invalid Input",
                  "Please make sure your Mile Post is written as a decimal value."
                );
              } else {
                props.onChangeText("mile_post", text);
              }
            }}
            value={flag.mile_post}
            placeholder={flag.mile_post ? flag.mile_post : ""}
          />
          <FsInputWithLabel
            editable={isActive}
            inputStyle={!isActive && inactiveInputStyle}
            label={"IDENTIFIER"}
            labelStyle={labelStyles}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="next"
            selectTextOnFocus={true}
            containerStyle={{ flex: 2, marginLeft: 12 }}
            onChangeText={(text) => {
              props.onChangeText("serial_number", text);
            }}
            value={flag.serial_number}
            placeholder={isActive && !isSwitchLocks ? "Optional" : ""}
          />
        </>
      ) : (
        <>
          <FsInputWithLabel
            editable={isActive}
            inputStyle={!isActive && inactiveInputStyle}
            label={
              isDerail && flag.type !== "red" ? "SERIAL NUMBER" : "MILE POST"
            }
            labelStyle={labelStyles}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="next"
            selectTextOnFocus={true}
            containerStyle={{ flex: 3, marginLeft: 12 }}
            onChangeText={(text) => {
              props.onChangeText(
                isDerail && flag.type !== "red" ? "serial_number" : "mile_post",
                text
              );
            }}
            value={
              isDerail && flag.type !== "red"
                ? flag.serial_number
                : flag.mile_post
            }
            placeholder={
              isDerail && flag.type !== "red"
                ? flag.serial_number
                  ? flag.serial_number
                  : flag.mile_post
                    ? flag.mile_post
                    : ""
                : ""
            }
          />
        </>
      )}
      {tracksForOrg.length ? (
        <View style={{ display: "flex", flex: 2, bottom: 1, marginLeft: 12 }}>
          <Dropdown
            labelFontSize={0}
            fontSize={Fonts.size.small}
            style={{
              fontFamily: Styles.constant.FontFamily,
              color: Colors.black,
              fontSize: Fonts.size.small,
              marginLeft: 8,
              backgroundColor: "transparent",
              height: 29,
            }}
            inputContainerStyle={{
              borderBottomColor: Colors.divider,
              borderBottomWidth: 1,
            }}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            baseColor={Colors.secondary}
            value={flag.track}
            data={[...tracksForOrg, { value: "Other" }]}
            onChangeText={(selectedTrack) =>
              props.onChangeText("track", selectedTrack)
            }
          ></Dropdown>
          <FsText
            style={{
              ...labelStyles,
              color: Colors.textSecondary,
              marginLeft: 20,
              top: 1,
            }}
          >
            TRACK
          </FsText>
        </View>
      ) : null}
      {/* {(!isSwitchLocks && !isDerail) && qrIdInput} */}
    </View>
  );
};

export default FlagCreationEntry;
