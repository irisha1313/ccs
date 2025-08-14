import { Dimensions, View, Platform } from 'react-native';

import Colors from './Colors';
import Fonts from './Fonts';

const ScreenHeights = {
  iphone4: 480,
  iphone5: 568,
  iphone6: 667,
  iphone6plus: 736,
  iphonex: 812,
};

const constant = {
  TabNavigatorHeight: 50,
  ChartHeaderHeight: 60,
  // FontFamily: 'Trebuchet MS',
  FontFamily: 'RobotoCondensed-Regular',
  TrxCol1Width: '12%',
  TrxCol2Width: '68%',
  TrxCol3Width: '20%',
  RotisserieHeight: 56,
  TrxTagHeight: 24, // just a guess
  StackNavigatorHeaderBarHeight: 64,
  InboxHeaderHeight: 66, // just a guess
  BubbleMarginTop: 12,
  InputHeight: 24,
  HiwPopupWidth:
    Dimensions.get('window').height <= ScreenHeights.iphone5 ? 260 : 300,
  HiwPopupPadding: 26, // includes border
  HiwPopupFooterHeight: 32 + 12 + 12 + 12 + 14 + 4, // marginTop, button padding, popup padding, text height, +4 extra
  SomeChartHeight: 34,
  MapViewEdgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
  MapViewEdgePaddingGoogleMaps: { top: 40, right: 10, bottom: 40, left: 10 },
  BorderRadius: 2,
};

const shadowLightBorder = {
  borderTopWidth: 0.5,
  borderLeftWidth: 0.5,
  borderRightWidth: 0,
  borderColor: Colors.textLight,
};

const lightShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  android: {
    elevation: 5,
  },
});

const general = {
  BigButtonStyle: [
    { borderRadius: constant.BorderRadius },
    { backgroundColor: Colors.secondarySharp },
    shadowLightBorder,
    lightShadow,
    { alignSelf: 'center' },
    { minWidth: 280 },
  ],
  header: {
    padding: 0,
    shadowOpacity: 0,
  },
  headerButton: {
    backgroundColor: Colors.transparent,
    shadowOpacity: 0, // IOS
    elevation: 0, // Android
  },
  borderBlack: {
    borderColor: Colors.black,
    borderWidth: 1,
  },
  borderGreen: {
    borderColor: Colors.green,
    borderWidth: 1,
  },
  borderPink: {
    borderColor: Colors.pink,
    borderWidth: 1,
  },
  borderAccent: {
    borderColor: Colors.secondary,
    borderWidth: 1,
  },

  bordered: {
    borderColor: Colors.pink,
    borderWidth: 1,
  },

  backgroundWhite: {
    backgroundColor: Colors.white,
  },

  backgroundOffWhite: {
    backgroundColor: Colors.offwhite,
  },

  backgroundGrey: {
    backgroundColor: Colors.backgroundColor,
  },

  backgroundBlack: {
    backgroundColor: '#000000',
  },

  width100pct: {
    width: '100%',
  },

  fontFamily: {
    fontFamily: constant.FontFamily,
  },

  chartBorder: {
    borderRadius: 12,
    borderColor: Colors.divider,
    borderWidth: 0.5,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },

  bubbleBorder0: {
    borderColor: Colors.divider,
    borderWidth: 0.5,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },

  bubbleBorder: {
    borderRadius: 12,
    borderColor: Colors.divider,
    borderWidth: 0.5,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },

  bubbleBorderWhite: {
    borderRadius: 12,
    borderColor: Colors.white,
    borderWidth: 1,
  },

  bubblePadding: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  fsInputStyle: {
    fontFamily: constant.FontFamily,
    fontSize: Fonts.size.normal,
    color: Colors.text,
    borderBottomWidth: 1,
    borderColor: Colors.divider,
    paddingHorizontal: 8,
    paddingVertical: 4,

    ...Platform.select({
      ios: {},
      android: { paddingVertical: 0 },
    }),
  },

  cbInputStyleBig: {
    fontFamily: constant.FontFamily,
    fontSize: Fonts.size.normal,
    color: Colors.text,
    ...Platform.select({
      ios: {},
      android: { paddingVertical: 0 },
    }),
  },

  fsInputStyleMultiline: Platform.select({
    ios: { paddingVertical: 32 },
    android: {
      paddingVertical: 8,
      textAlignVertical: 'top',
    },
  }),

  cbHowItWorksIconStyle: {
    marginTop: 40,
    alignSelf: 'center',
  },

  cbNoAccountLinkedCbText: {
    color: Colors.textSecondary,
    fontSize: Fonts.size.normal,
    textAlign: 'center',
  },

  cbNoDataAvailable: {
    color: Colors.textSecondary,
    fontSize: Fonts.size.small,
    textAlign: 'center',
  },

  TrxCol1: {
    // width: constant.TrxCol1Width,
  },

  TrxCol2: {
    // width: constant.TrxCol2Width,
    flex: 1,
  },

  TrxCol3: {
    minWidth: constant.TrxCol3Width,
  },

  inlineSubText: {
    fontSize: Fonts.size.xxsmall,
    color: Colors.textSecondary,
  },

  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.9,
      shadowRadius: 2,
    },
    android: {
      elevation: 5,
    },
  }),
  lightShadow,
  shadowLightBorder,
};

export default {
  constant,
  general,
};
