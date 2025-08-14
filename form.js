import React from "react";
import _ from "lodash";
import { View } from "react-native";
import moment from "moment-timezone";
import { Dropdown } from "react-native-material-dropdown-v2";

import {
  FsAlert,
  FsInputWithLabel,
  FsText,
} from "../../components/CustomComponents";
import { Fonts, Styles, Colors } from "../../constants";
import componentStyles from "./styles";
import {
  statesDropdownArray,
  BNFSDivisions,
  BNFSSubDivisions,
  UPDivisions,
  UPSubDivisions,
  NSDivisions,
  NSSubivisions,
  fecCitiesDropdownArray,
  timezonesDropdownArray,
  CpkcSouthSubdivisions,
} from "./staticData";
import TimePicker from "../../components/TimePicker";

class CreateFormBForm extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTimezoneDropdown = (currentTimezone, onScheduleChange) => (
    <View style={{ minWidth: 180 }}>
      <Dropdown
        labelFontSize={0}
        dropdownOffset={{ top: 5, left: 5 }}
        fontSize={Fonts.size.small}
        style={{
          fontFamily: Styles.constant.FontFamily,
          color: Colors.black,
          marginTop: 0,
          backgroundColor: "transparent",
        }}
        containerStyle={{
          paddingHorizontal: 5,
          width: "100%",
          alignSelf: "center",
        }}
        value={currentTimezone}
        data={timezonesDropdownArray}
        onChangeText={(selectedType) =>
          onScheduleChange("timezone", selectedType)
        }
      />
    </View>
  );

  renderCitiesDropdown = (city, onCityChange) => (
    <View
      style={{
        paddingHorizontal: 8,
      }}
    >
      <Dropdown
        labelFontSize={0}
        fontSize={Fonts.size.small}
        style={{
          fontFamily: Styles.constant.FontFamily,
          color: Colors.black,
          marginTop: 0,
          backgroundColor: "transparent",
        }}
        containerStyle={{
          width: "100%",
          alignSelf: "center",
        }}
        value={city}
        data={fecCitiesDropdownArray}
        onChangeText={(selectedCity) => onCityChange(selectedCity)}
      />
      <FsText
        style={[
          { fontSize: Fonts.size.xxsmall },
          { color: Colors.textSecondary },
        ]}
      >
        CITY
      </FsText>
    </View>
  );

  renderBNFSSubdivisionDropdown = (data, subDivision, onSubdivisionChange) => (
    <View
      style={{
        paddingHorizontal: 8,
      }}
    >
      <Dropdown
        labelFontSize={0}
        fontSize={Fonts.size.small}
        style={{
          fontFamily: Styles.constant.FontFamily,
          color: Colors.black,
          marginTop: 0,
          backgroundColor: "transparent",
        }}
        containerStyle={{
          width: "100%",
          alignSelf: "center",
        }}
        value={subDivision}
        data={data}
        onChangeText={(selectedSubdivision) =>
          onSubdivisionChange(selectedSubdivision)
        }
      />
      <FsText
        style={[
          { fontSize: Fonts.size.xxsmall },
          { color: Colors.textSecondary },
        ]}
      >
        SUBDIVISION
      </FsText>
    </View>
  );

  renderCustomDivisionsDropdown = (title, division, data, onDivisionChange) => (
    <View
      style={{
        paddingHorizontal: 8,
      }}
    >
      <Dropdown
        labelFontSize={0}
        fontSize={Fonts.size.small}
        style={{
          fontFamily: Styles.constant.FontFamily,
          color: Colors.black,
          marginTop: 0,
          backgroundColor: "transparent",
        }}
        containerStyle={{
          width: "100%",
          alignSelf: "center",
        }}
        value={division}
        data={data}
        onChangeText={(selectedDivision) => onDivisionChange(selectedDivision)}
      />
      <FsText
        style={[
          { fontSize: Fonts.size.xxsmall },
          { color: Colors.textSecondary },
        ]}
      >
        {title}
      </FsText>
    </View>
  );

  renderStatesDropdown = (city, onStateChange) => (
    <View
      style={{
        paddingHorizontal: 8,
      }}
    >
      <Dropdown
        labelFontSize={0}
        fontSize={Fonts.size.small}
        style={{
          fontFamily: Styles.constant.FontFamily,
          color: Colors.black,
          marginTop: 0,
          backgroundColor: "transparent",
        }}
        containerStyle={{
          width: "100%",
          alignSelf: "center",
        }}
        value={city}
        data={statesDropdownArray}
        onChangeText={(selectedState) => onStateChange(selectedState)}
      />
      <FsText
        style={[
          { fontSize: Fonts.size.xxsmall },
          { color: Colors.textSecondary },
        ]}
      >
        STATE
      </FsText>
    </View>
  );

  render() {
    const {
      formb,
      onChangeText,
      onScheduleChange,
      currentOrganizationId,
      loggedInUserIsManagement,
    } = this.props;
    const isBNFS =
      currentOrganizationId === 2 ||
      currentOrganizationId === 94 ||
      currentOrganizationId === 106;
    const isUP =
      currentOrganizationId === 6 ||
      currentOrganizationId === 8 ||
      currentOrganizationId === 9;
    const isNS = currentOrganizationId === 22;
    const isCpkcSouth = currentOrganizationId === 12;
    const { open_time, close_time, timezone, original_close_time } = formb;
    const {
      subdivision,
      city,
      state,
      job_number,
      job_site_mile_post,
      extra_data: { division = "" },
    } = formb;
    const divisionsDropdownData = isUP
      ? UPDivisions
      : isBNFS
      ? BNFSDivisions
      : NSDivisions;
    const subdivisionDropdownData = isUP
      ? UPSubDivisions[division]
      : isBNFS
      ? BNFSSubDivisions[division]
      : isCpkcSouth
      ? CpkcSouthSubdivisions
      : NSSubivisions[division];

    return (
      <View style={componentStyles.CreateFormBForm}>
        {(isBNFS || isUP || isNS) &&
          this.renderCustomDivisionsDropdown(
            isUP ? "Service Unit" : "DIVISION",
            division,
            divisionsDropdownData,
            (newDivision) => {
              onChangeText("division", newDivision, true);
              onChangeText("subdivision", "");
            }
          )}
        {(isBNFS || isUP || isNS || isCpkcSouth) &&
          this.renderBNFSSubdivisionDropdown(
            subdivisionDropdownData,
            subdivision,
            (newSubdivision) => {
              onChangeText("subdivision", newSubdivision);
            }
          )}
        {currentOrganizationId !== 10 &&
          !isBNFS &&
          !isUP && // FLAG-342
          !isNS &&
          !isCpkcSouth && (
            <FsInputWithLabel
              name="subdivision"
              label="SUBDIVISION"
              selectTextOnFocus={true}
              containerStyle={[{ marginTop: 24 }]}
              returnKeyType="next"
              autoCapitalize="words"
              onChangeText={(text) => {
                onChangeText("subdivision", text);
              }}
              value={subdivision}
              placeholder={subdivision ? subdivision : ""}
            />
          )}
        {currentOrganizationId !== 10 ? (
          <FsInputWithLabel
            name="city"
            label="CITY"
            selectTextOnFocus={true}
            returnKeyType="next"
            autoCapitalize="words"
            containerStyle={[{ marginTop: 24 }]}
            onChangeText={(text) => {
              onChangeText("city", text);
            }}
            value={city}
            placeholder={city ? city : ""}
          />
        ) : (
          this.renderCitiesDropdown(city, (newCity) =>
            onChangeText("city", newCity)
          )
        )}
        {this.renderStatesDropdown(state, (newState) =>
          onChangeText("state", newState)
        )}
        <FsInputWithLabel
          name="job_number"
          label="JOB NUMBER"
          selectTextOnFocus={true}
          returnKeyType="next"
          autoCapitalize="words"
          containerStyle={[{ marginTop: 24 }]}
          onChangeText={(text) => {
            onChangeText("job_number", text);
          }}
          value={job_number}
          placeholder={job_number ? job_number : ""}
        />
        <FsInputWithLabel
          name="job_site_mile_post"
          label="JOB SITE MILE POST"
          selectTextOnFocus={true}
          returnKeyType="next"
          autoCapitalize="words"
          containerStyle={[{ marginTop: 24 }]}
          onChangeText={(text) => {
            onChangeText("job_site_mile_post", text);
          }}
          value={job_site_mile_post}
          placeholder={job_site_mile_post ? job_site_mile_post : ""}
        />
        <TimePicker
          title="OPEN TIME (HH:MM)"
          labelStyle={{
            fontFamily: "RobotoCondensed-Regular",
            fontSize: Fonts.size.normal,
            color: "black",
          }}
          value={open_time}
          onChange={(time) => {
            const newOpenTime = moment(time)
              .seconds(0)
              .milliseconds(0)
              .format("HH:mm");
            onScheduleChange("open_time", newOpenTime);
          }}
          labelRight={
            loggedInUserIsManagement
              ? this.renderTimezoneDropdown(timezone, onScheduleChange)
              : "TZ: " + timezone
          }
          labelRightStyle={
            loggedInUserIsManagement && {
              fontFamily: "RobotoCondensed-Regular",
              fontSize: Fonts.size.normal,
              color: "black",
            }
          }
          containerStyle={{ marginTop: 24 }}
          buttonLabelStyle={{
            width: "100%",
            padding: 0,
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            borderColor: "#BDBDBD",
          }}
        />
        <TimePicker
          title="CLOSE TIME (HH:MM)"
          labelStyle={{
            fontFamily: "RobotoCondensed-Regular",
            fontSize: Fonts.size.normal,
            color: "black",
          }}
          value={original_close_time || close_time}
          onPress={async () => {
            if (original_close_time) {
              await FsAlert.alertOk(
                "Unable to update this protections close time as there is an ongoing early cancellation."
              );
              return false;
            }
            return true;
          }}
          onChange={(time) => {
            const newOpenTime = moment(time)
              .seconds(0)
              .milliseconds(0)
              .format("HH:mm");
            onScheduleChange("close_time", newOpenTime);
          }}
          labelRight={
            loggedInUserIsManagement
              ? this.renderTimezoneDropdown(timezone, onScheduleChange)
              : "TZ: " + timezone
          }
          labelRightStyle={
            loggedInUserIsManagement && {
              fontFamily: "RobotoCondensed-Regular",
              fontSize: Fonts.size.normal,
              color: "black",
            }
          }
          containerStyle={{ marginTop: 24 }}
          buttonLabelStyle={{
            width: "100%",
            padding: 0,
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            borderColor: "#BDBDBD",
          }}
        />
      </View>
    );
  }
}

export default CreateFormBForm;
