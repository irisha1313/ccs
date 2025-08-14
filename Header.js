import React from 'react';
import { Header, Button, Body, Text } from 'native-base';
import { useDispatch } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Styles, Icons, Colors } from '../constants';
import titleStyles from '../theme/components/Title';

const AppHeader = ({
  hasBackButton,
  actionButton,
  title,
  titlePaddingRight = 45,
  onBackPress,
}) => {
  const dispatch = useDispatch();
  const goBackAction = onBackPress
    ? onBackPress
    : () => dispatch(NavigationActions.back());

  const numberOfChilds =
    actionButton && actionButton.props && actionButton.props.children.length;

  return (
    <Header
      contentContainerStyle={{ flex: 1 }}
      style={{
        ...Styles.general.header,
        paddingTop: 0,
        height: 56,
      }}
    >
      {hasBackButton && (
        <Button
          onPress={goBackAction}
          style={{ ...Styles.general.headerButton }}
        >
          <MaterialCommunityIcons
            name={'arrow-left'}
            size={Icons.size.big}
            color={Colors.textLight}
            style={{ textAlign: 'center', maxWidth: 24 }}
          />
        </Button>
      )}

      <Body
        style={{
          alignItems: 'center',
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <Text
          style={{
            ...titleStyles({
              titleFontfamily: 'System',
              titleFontSize: 19,
              subTitleFontSize: 14,
              subtitleColor: '#FFF',
              titleFontColor: '#FFF',
            }),
            alignItems: 'center',
            paddingLeft: numberOfChilds
              ? numberOfChilds * 45
              : actionButton
              ? 45
              : 0,
            paddingRight: hasBackButton ? titlePaddingRight : 0,
          }}
        >
          {title}
        </Text>
      </Body>
      {actionButton}
    </Header>
  );
};

export default AppHeader;
