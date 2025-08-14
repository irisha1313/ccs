import { Animated, Easing } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import {
  Login,
  FormBsScreen,
  CreateFormBScreen,
  IncidentReportScreen,
  FlagMapScreen,
  EstablishFlagMapScreen,
  OrganizationsScreen,
  OrganizationScreen,
  ProfileScreen,
  FlagDetailsScreen,
  SendOnDemandReportScreen,
  SendIncidentReportScreen,
  CreateNewUserScreen,
  CreateJobBriefingScreen,
  FlagLocationVerificationScreen,
  UserOrgTransfer,
  ArchivedFormBsScreen,
  FormBsOwnershipTransferScreen,
  PropertySettingsScreen,
  MultipleOptionSelectionScreen,
  ReportBugScreen,
  SystemInformationScreen,
  SafeClearScreen,
  SafeClearCreateLogScreen,
  SafeClearCreateUserScreen,
  SafeClearActiveLogScreen,
  SafeClearSubmittedLogScreen,
  SafeClearUserStatusScreen,
  SafeClearSubmittedUserStatusScreen,
  SafeClearEntryNotesScreen,
} from '../containers';
import { NoInternet, AppFooter } from '../components';
import { Screens } from '../constants';
import { Screens as SafeClearScreens } from '../constants/SafeClear';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

const transitionConfig = () => ({
  transitionSpec: {
    duration: 300,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
  },
  screenInterpolator: (sceneProps) => {
    const { layout, position, scene } = sceneProps;
    const { index } = scene;

    const height = layout.initHeight;
    const translateY = position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [height, 0, 0],
    });

    const opacity = position.interpolate({
      inputRange: [index - 1, index - 0.99, index],
      outputRange: [0, 1, 1],
    });

    return { opacity, transform: [{ translateY }] };
  },
});

// login stack
const LoginStack = createStackNavigator(
  {
    [Screens.Login.route]: { screen: Login },
    [Screens.ReportBugScreen.route]: { screen: ReportBugScreen },
    [Screens.NoInternet.route]: { screen: NoInternet },
  },
  {
    headerMode: 'none',
    initialRouteName: Screens.Login.route,
    transitionConfig: transitionConfig,
  }
);

const safeClearActiveLogStack = createStackNavigator(
  {
    [SafeClearScreens.ActiveLogScreen.route]: {
      screen: SafeClearActiveLogScreen,
    },
    [SafeClearScreens.UserStatusScreen.route]: {
      screen: SafeClearUserStatusScreen,
    },
    [SafeClearScreens.CreateUserScreen.route]: {
      screen: SafeClearCreateUserScreen,
    },
    [SafeClearScreens.EntryNotesScreen.route]: {
      screen: SafeClearEntryNotesScreen,
    },
  },
  {
    headerMode: 'none',
    transitionConfig: transitionConfig,
  }
);

const safeClearSubmittedLogStack = createStackNavigator(
  {
    [SafeClearScreens.SubmittedLogScreen.route]: {
      screen: SafeClearSubmittedLogScreen,
    },
    [SafeClearScreens.EntryNotesScreen.route]: {
      screen: SafeClearEntryNotesScreen,
    },
    [SafeClearScreens.SubmittedUserStatusScreen.route]: {
      screen: SafeClearSubmittedUserStatusScreen,
    },
  },
  {
    headerMode: 'none',
    transitionConfig: transitionConfig,
  }
);

const safeClearStack = createStackNavigator(
  {
    [SafeClearScreens.Home.route]: {
      screen: SafeClearScreen,
    },
    [SafeClearScreens.CreateLogScreen.route]: {
      screen: SafeClearCreateLogScreen,
    },
    [SafeClearScreens.ActiveLogScreen.route]: {
      screen: safeClearActiveLogStack,
    },
    [SafeClearScreens.SubmittedLogScreen.route]: {
      screen: safeClearSubmittedLogStack,
    },
  },
  {
    headerMode: 'none',
    transitionConfig: transitionConfig,
  }
);

// protection stack
const formStack = createStackNavigator(
  {
    [Screens.FormBsScreen.route]: { screen: FormBsScreen },
    [Screens.SendIncidentReportScreen.route]: {
      screen: SendIncidentReportScreen,
    },
    [SafeClearScreens.Home.route]: { screen: safeClearStack },
    [Screens.CreateFormBScreen.route]: { screen: CreateFormBScreen },
    [Screens.IncidentReportScreen.route]: { screen: IncidentReportScreen },
    [Screens.FlagMapScreen.route]: { screen: FlagMapScreen },
    [Screens.EstablishFlagMapScreen.route]: { screen: EstablishFlagMapScreen },
    [Screens.FlagDetailsScreen.route]: { screen: FlagDetailsScreen },
    [Screens.CreateJobBriefingScreen.route]: {
      screen: CreateJobBriefingScreen,
    },
    [Screens.FlagLocationVerificationScreen.route]: {
      screen: FlagLocationVerificationScreen,
    },
    [Screens.UserOrgTransfer.route]: {
      screen: UserOrgTransfer,
    },
    [Screens.ArchivedFormBsScreen.route]: {
      screen: ArchivedFormBsScreen,
    },
    [Screens.FormBsOwnershipTransferScreen.route]: {
      screen: FormBsOwnershipTransferScreen,
    },
  },
  {
    headerMode: 'none',
    transitionConfig: transitionConfig,
  }
);

const organizationStack = createStackNavigator(
  {
    [Screens.OrganizationScreen.route]: { screen: OrganizationScreen },
    [Screens.CreateNewUserScreen.route]: { screen: CreateNewUserScreen },
    [Screens.PropertySettingsScreen.route]: { screen: PropertySettingsScreen },
    [Screens.MultipleOptionSelectionScreen.route]: {
      screen: MultipleOptionSelectionScreen,
    },
    OthersFormBSScreen: { screen: formStack },
  },
  {
    headerMode: 'none',
    transitionConfig: transitionConfig,
  }
);

const vpOrganizationStack = createStackNavigator(
  {
    [Screens.OrganizationsScreen.route]: { screen: OrganizationsScreen },
    [Screens.OrganizationScreen.route]: { screen: organizationStack },
  },
  {
    headerMode: 'none',
    transitionConfig: transitionConfig,
  }
);

const profileStack = createStackNavigator(
  {
    [Screens.ProfileScreen.route]: { screen: ProfileScreen },
    [Screens.ReportBugScreen.route]: { screen: ReportBugScreen },
    [Screens.SystemInformationScreen.route]: {
      screen: SystemInformationScreen,
    },
  },
  {
    headerMode: 'none',
  }
);

const tabNavigation = createBottomTabNavigator(
  {
    [Screens.OrganizationScreen.route]: { screen: organizationStack },
    FormTabScreen: { screen: formStack },
    [SafeClearScreens.Home.route]: { screen: safeClearStack },
    [Screens.ProfileScreen.route]: { screen: profileStack },
    [Screens.SendOnDemandReportScreen.route]: {
      screen: SendOnDemandReportScreen,
    },
  },
  {
    headerMode: 'none',
    tabBarComponent: AppFooter,
    resetOnBlur: true,
  }
);
const vpTabNavigation = createBottomTabNavigator(
  {
    [Screens.OrganizationsScreen.route]: { screen: vpOrganizationStack },
    FormTabScreen: { screen: formStack },
    [Screens.ProfileScreen.route]: { screen: profileStack },
    [Screens.SendOnDemandReportScreen.route]: {
      screen: SendOnDemandReportScreen,
    },
  },
  {
    headerMode: 'none',
    tabBarComponent: AppFooter,
    transitionConfig: transitionConfig,
  }
);

// Manifest of possible screens
const PrimaryNav = createAppContainer(
  createSwitchNavigator(
    {
      [Screens.SignOutStack.route]: { screen: LoginStack },
      NormalRole: { screen: tabNavigation },
      HighRole: { screen: vpTabNavigation },
    },
    {
      headerMode: 'none',
      title: Screens.Title,
      initialRouteName: Screens.SignOutStack.route,
    }
  )
);

export default PrimaryNav;
