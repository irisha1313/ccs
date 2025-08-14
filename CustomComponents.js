import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { ScrollView } from "react-native";
import { Colors, Fonts, Icons, Styles } from "../constants";
import _ from "lodash";
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

/**
 * @prop isVisible
 */
const FsActivityIndicator = (props) => {
  return (
    <View style={[{ height: 24 }, props.containerStyle]}>
      <ActivityIndicator
        animating={props.isVisible ? true : false}
        size="small"
        color={_.defaultTo(props.color, Colors.secondary)}
      />
    </View>
  );
};

/**
 * @prop isVisible
 */
const FsActivityIndicatorHeaderTitle = (props) => {
  return (
    <FsActivityIndicator isVisible={true} color={Colors.headerTintColor} />
  );
};

/**
 * @prop <Text> props
 *
 * @return <Text> w/ Fonts.primary*/
const FsText = ({ children, ...props }) => {
  return (
    <Text
      style={[
        Fonts.primary,
        { color: Colors.text },
        { fontSize: Fonts.size.normal },
        props.style,
      ]}
      {..._.omit(props, ["style", "onRef"])}
      ref={props.onRef}
    >
      {children}
    </Text>
  );
};

/**
 * @prop <TouchableOpacity> props
 *
 */
const FsButton = ({ children, disabled, ...props }) => {
  return (
    <TouchableOpacity
      style={[{ padding: 12, opacity: disabled ? 0.5 : 1 }, props.style]}
      ref={props.onRef}
      disabled={disabled}
      {..._.omit(props, ["style"])}
    >
      {children}
    </TouchableOpacity>
  );
};

/**
 * @prop <FsButton> props
 * @prop radius
 *
 */
const FsButtonRound = ({ children, ...props }) => {
  return (
    <FsButton
      style={[
        { height: props.radius * 2 },
        { width: props.radius * 2 },
        { alignItems: "center", justifyContent: "center" },
        { borderRadius: props.radius },
        { borderWidth: 0.5, borderColor: Colors.divider },
        props.style,
      ]}
      {..._.omit(props, ["style", "radius"])}
    >
      {children}
    </FsButton>
  );
};

/**
 * @prop buttonStyle
 * @prop textStyle
 * @prop title
 */
const FsButtonAction = (props) => {
  return (
    <FsButton
      style={[
        { backgroundColor: Colors.secondarySharp },
        { paddingHorizontal: 16 },
        { minWidth: 150 },
        { borderRadius: Styles.constant.BorderRadius },
        { alignItems: "center" },
        Styles.general.shadowLightBorder,
        Styles.general.lightShadow,
        props.style,
      ]}
      onPress={props.onPress}
    >
      <FsText style={[{ color: Colors.textLight }, props.textStyle]}>
        {props.title}
      </FsText>
    </FsButton>
  );
};

/**
 * @prop buttonStyle
 * @prop textStyle
 * @prop title
 * @prop renderIcon
 */
const FsButtonActionIcon = (props) => {
  return (
    <FsButton
      disabled={props.disabled}
      style={[
        { backgroundColor: Colors.secondarySharp },
        { paddingHorizontal: 16 },
        { minWidth: 150 },
        { borderRadius: Styles.constant.BorderRadius },
        { alignItems: "center" },
        Styles.general.shadowLightBorder,
        Styles.general.lightShadow,
        props.style,
      ]}
      onPress={props.onPress}
    >
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        {props.renderIcon(Colors.textLight)}
        {props.title ? (
          <FsText
            style={[
              { color: Colors.textLight },
              { paddingHorizontal: 8 },
              props.textStyle,
            ]}
          >
            {props.title}
          </FsText>
        ) : null}
      </View>
    </FsButton>
  );
};

/**
 *
 */
const FsAlertProto = {
  init() {
    return this;
  },

  /**
   * @return promise
   */
  alertOk(title, msg) {
    return new Promise((onSuccess) => {
      Alert.alert(
        title,
        msg,
        [
          {
            text: "OK",
            onPress: () => onSuccess(true),
          },
        ],
        { cancelable: false }
      );
    });
  },

  alertYesCancel(title, msg, yesText = "Yes", noText = "Cancel") {
    return new Promise((onSuccess, onReject) => {
      Alert.alert(
        title,
        msg,
        [
          {
            text: yesText,
            onPress: () => onSuccess(true),
          },
          {
            text: noText,
            style: "cancel",
            onPress: () => onReject(false),
          },
        ],
        { cancelable: false }
      );
    });
  },

  alertOptions(title, msg, options = [], noText = "Cancel") {
    return new Promise((onSuccess, onReject) => {
      Alert.alert(
        title,
        msg,
        [
          ...options.map((optionText) => ({
            text: optionText,
            onPress: () => onSuccess(optionText),
          })),
        ],
        { cancelable: false }
      );
    });
  },

  alertOptionsCancel(title, msg, options = [], noText = "Cancel") {
    return new Promise((onSuccess, onReject) => {
      Alert.alert(
        title,
        msg,
        [
          ...options.map((optionText) => ({
            text: optionText,
            onPress: () => onSuccess(optionText),
          })),
          {
            text: noText,
            style: "cancel",
            onPress: () => onReject(false),
          },
        ],
        { cancelable: false }
      );
    });
  },
};

const FsAlert = Object.freeze(Object.create(FsAlertProto).init());

/**
 * @prop containerStyle
 * @prop onRefresh
 */
const FsScrollView = ({ children, ...props }) => {
  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      nestedScrollEnabled={props.nestedScrollEnabled}
      contentContainerStyle={[
        { paddingTop: 40 },
        { paddingBottom: 120 },
        props.containerStyle,
        props.contentContainerStyle,
      ]}
      scrollEnabled={true}
      refreshControl={
        typeof props.refreshing !== "undefined" ? (
          <RefreshControl
            refreshing={props.refreshing}
            onRefresh={() => {
              if (props.onRefresh) {
                props.onRefresh();
              }
            }}
          />
        ) : null
      }
    >
      {children}
    </ScrollView>
  );
};

const FsScreen = ({ children, ...props }) => {
  return (
    <SafeAreaView style={[{ flex: 1 }, Styles.general.backgroundOffWhite]}>
      {children}
    </SafeAreaView>
  );
};

/**
 * @prop containerStyle
 * @prop onRefresh
 */
const ScrollableScreen = ({ children, ...props }) => {
  return <FsScrollView {...props}>{children}</FsScrollView>;
};

/**
 * @prop <Button> props
 */
const HeaderBackButton = (props) => {
  return (
    <FsButton {...props}>
      <MaterialIcons
        name="chevron-left"
        size={24}
        color={Colors.headerTintColor}
      />
    </FsButton>
  );
};

/**
 * @prop <Button> props
 */
const HeaderSaveButton = (props) => {
  return (
    <FsButton {...props}>
      <FsText
        style={[
          { fontSize: Fonts.size.normal },
          { color: Colors.headerTintColor },
          { fontWeight: "bold" },
        ]}
      >
        Save
      </FsText>
    </FsButton>
  );
};

/**
 * @prop <Button> props
 * @prop text
 */
const HeaderTextButton = (props) => {
  return (
    <FsButton {...props}>
      <FsText
        style={[
          { fontSize: Fonts.size.normal },
          { color: Colors.headerTintColor },
          { fontWeight: "bold" },
        ]}
      >
        {props.text}
      </FsText>
    </FsButton>
  );
};

/**
 * @prop label
 * @prop labelRight
 * @prop containerStyle
 * @prop onRef
 * @prop inputStyle
 * @prop labelStyle
 *
 */
const FsInputWithLabel = (props) => {
  return (
    <View style={[props.containerStyle]}>
      <TextInput
        ref={props.onRef}
        placeholderTextColor={Colors.textSecondary}
        style={[Styles.general.fsInputStyle, props.inputStyle]}
        {..._.omit(props, [
          "onRef",
          "inputStyle",
          "containerStyle",
          "labelStyle",
        ])}
      />
      <View
        style={[
          { marginTop: 2 },
          { paddingHorizontal: 8 },
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
      >
        <FsText
          style={[
            { fontSize: Fonts.size.xxsmall },
            { color: Colors.textSecondary },
            props.labelStyle,
          ]}
        >
          {props.label ? props.label : ""}
        </FsText>
        {typeof props.labelRight === "string" ? (
          <FsText
            style={[
              { fontSize: Fonts.size.xxsmall },
              { color: Colors.textSecondary },
              props.labelStyle,
            ]}
          >
            {props.labelRight}
          </FsText>
        ) : (
          props.labelRight
        )}
      </View>
    </View>
  );
};

/**
 *
 * @prop label
 */
class PasswordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPasswordVisible: false,
    };
  }

  render() {
    return (
      <View style={[{ alignSelf: "stretch" }, this.props.containerStyle]}>
        <View style={[{ flexDirection: "row", alignItems: "center" }]}>
          <MaterialIcons
            name="lock-outline"
            size={Icons.size.normal}
            color={Colors.text}
          />
          <TextInput
            ref={this.props.onRef}
            placeholderTextColor={Colors.textSecondary}
            secureTextEntry={!this.state.isPasswordVisible}
            style={[
              Styles.general.fsInputStyle,
              { marginLeft: 12 },
              this.props.inputStyle,
            ]}
            {..._.omit(this.props, [
              "onRef",
              "inputStyle",
              "containerStyle",
              "labelStyle",
            ])}
          />
          <FsButton
            onPress={() =>
              this.setState((prevState) => ({
                isPasswordVisible: !prevState.isPasswordVisible,
              }))
            }
          >
            {this.state.isPasswordVisible ? (
              <FontAwesome
                name="eye"
                size={Icons.size.normal}
                color={Colors.text}
              />
            ) : (
              <FontAwesome
                name="eye-slash"
                size={Icons.size.normal}
                color={Colors.text}
              />
            )}
          </FsButton>
        </View>
        <FsText
          style={[
            { left: 40, top: -6 },
            { fontSize: Fonts.size.xxsmall },
            { color: Colors.textSecondary },
            this.props.labelStyle,
          ]}
        >
          {this.props.label}
        </FsText>
      </View>
    );
  }
}

/**
 * TODO
 * @prop title
 */
const FsButtonChevron = (props) => {
  return (
    <FsButton
      onPress={props.onPress}
      style={[
        { flexDirection: "row", alignItems: "center" },
        { borderBottomWidth: 1, borderColor: Colors.divider },
        props.containerStyle,
      ]}
    >
      <View style={[{ flex: 1 }]}>
        <FsText style={props.textStyle}>{props.title}</FsText>
      </View>
      <MaterialCommunityIcons
        name={"chevron-right"}
        size={Icons.size.xbig}
        color={Colors.primary}
      />
    </FsButton>
  );
};

export {
  FsActivityIndicator,
  FsActivityIndicatorHeaderTitle,
  FsButton,
  FsButtonAction,
  FsButtonActionIcon,
  FsButtonRound,
  FsText,
  FsAlert,
  FsInputWithLabel,
  FsScreen,
  FsScrollView,
  ScrollableScreen,
  HeaderBackButton,
  HeaderSaveButton,
  HeaderTextButton,
  PasswordInput,
  FsButtonChevron,
};
