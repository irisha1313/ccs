import React, { useContext } from "react";
import { View } from "react-native";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { NavigationActions } from "react-navigation";
import { Footer, FooterTab, Button, Text, Icon } from "native-base";
import isEmpty from "lodash/isEmpty";

import { USER_ROLES } from "../utils/userRoles";
import { FsAlert } from "../components/CustomComponents";
import { useIsOnline } from "../context/netStateContext";
import ConnectionStatusBar from "./offline/ConnectionStatusBar";

const AppFooter = () => {
  const dispatch = useDispatch();
  const isOnline = useIsOnline();
  const appState = useSelector((state) => {
    const navRoute = state.nav.routes[state.nav.index];
    return {
      user: state.auth.user,
      userId: state.auth.user.id,
      userName: state.auth.user.user_name,
      userRole: state.auth.user.role_id,
      routeState: navRoute.routes[navRoute.index],
      currentOrganization: state.organizations.currentOrganization.settings,
    };
  }, shallowEqual);
  const { userId, userName, userRole, routeState, currentOrganization } =
    appState;
  const { routeName } = routeState;
  const higherHome = userRole !== USER_ROLES.Flagmen;
  const homeRoute =
    userRole === USER_ROLES.SeniorVP || userRole === USER_ROLES.Director
      ? "OrganizationsScreen"
      : "OrganizationScreen";

  const checkIfOnOrganization = (next, fallbackOptions) => {
    if (isEmpty(currentOrganization)) {
      return FsAlert.alertOk(fallbackOptions.title, fallbackOptions.body);
    }

    if (typeof next === "function") {
      next();
    }
  };

  const goHome = () => {
    if (isOnline) {
      dispatch(
        NavigationActions.navigate({
          routeName: homeRoute,
        })
      );
    } else {
      dispatch(
        NavigationActions.navigate({
          routeName: "SafeClearHomeScreen",
          params: { userData: appState.user },
        })
      );
    }
  };

  return (
    <View>
      <ConnectionStatusBar />
      <Footer>
        <FooterTab>
          <Button active={routeName === homeRoute} onPress={goHome}>
            <Icon name="home-sharp" />
            <Text>Home</Text>
          </Button>
          {isOnline && (
            <Button
              active={routeName === "FormTabScreen"}
              onPress={() =>
                checkIfOnOrganization(
                  () => {
                    if (routeName !== "FormTabScreen") {
                      dispatch(
                        NavigationActions.navigate({
                          routeName: "FormTabScreen",
                        })
                      );
                    }
                  },
                  {
                    title: "My Protections",
                    body: "You must select a property before viewing your Protections.",
                  }
                )
              }
            >
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Icon name="file-document" type="MaterialCommunityIcons" />
                <Text
                  style={{
                    textAlign: "center",
                    paddingHorizontal: 0,
                    flexShrink: 1,
                  }}
                >
                  My Protections
                </Text>
              </View>
            </Button>
          )}
          {isOnline && higherHome && currentOrganization && (
            <Button
              active={routeName === "SendOnDemandReportScreen"}
              onPress={() =>
                checkIfOnOrganization(
                  () => {
                    if (routeName !== "SendOnDemandReportScreen") {
                      dispatch(
                        NavigationActions.navigate({
                          routeName: "SendOnDemandReportScreen",
                        })
                      );
                    }
                  },
                  {
                    title: "My Protections",
                    body: "You must select a property before sending a report.",
                  }
                )
              }
            >
              <Icon name="send" type="FontAwesome" />
              <Text>Report</Text>
            </Button>
          )}
          {isOnline && (
            <Button
              active={routeName === "ProfileScreen"}
              onPress={() => {
                if (routeName !== "ProfileScreen") {
                  dispatch(
                    NavigationActions.navigate({
                      routeName: "ProfileScreen",
                      params: { userId, userName },
                    })
                  );
                }
              }}
            >
              <Icon name="settings-sharp" />
              <Text> Settings </Text>
            </Button>
          )}
        </FooterTab>
      </Footer>
    </View>
  );
};
export default AppFooter;
