import React from 'react';
import { useDispatch } from 'react-redux';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { DraxView } from 'react-native-drax';
import moment from 'moment-timezone';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';
import omit from 'lodash/omit';

import { Icons, Colors, Fonts } from '../../../../constants';
import { User, Formats } from '../../../../constants/SafeClear';
import { ScrollableScreen } from '../../../../components/CustomComponents';
import {
  handleAddUserToLog,
  handleEditUserInLog,
} from '../../../../sharedMethods/SafeClear/users';

const DraggableCard = ({ data, possibleStatusAttributeName }) => {
  const dispatch = useDispatch();

  const statusAttributeName =
    possibleStatusAttributeName || data.statusAttributeName;
  const actionTimeColor =
    statusAttributeName === 'signedIn' || statusAttributeName === 'excepted'
      ? Colors.secondarySharpDark
      : Colors.red;
  const shouldRenderMilePost = statusAttributeName !== 'signedOut';

  let alternativeMilePostSize;

  if (shouldRenderMilePost && data.milepost) {
    if (data.milepost.length > 7) {
      alternativeMilePostSize = styles.xxxxsmallText;
    } else if (data.milepost.length > 6) {
      alternativeMilePostSize = styles.xxxsmallText;
    } else if (data.milepost.length > 5) {
      alternativeMilePostSize = styles.xxSmallText;
    }
  }

  return (
    <DraxView
      style={[styles.centeredContent, styles.draggableCard]}
      draggingStyle={styles.dragging}
      dragReleasedStyle={styles.dragging}
      dragPayload={data}
      longPressDelay={200}
      onTouchEnd={() => {
        const currentUserWithStatus = {
          ...omit(data, 'milepost'),
          milepost: data.milepost,
        };
        dispatch(handleEditUserInLog(NavigationActions, currentUserWithStatus));
      }}
    >
      <View style={styles.draggableCardContainer}>
        {shouldRenderMilePost && (
          <>
            <Text
              style={[
                styles.draggableCardText,
                alternativeMilePostSize,
                { flex: 2 },
              ]}
            >
              {data.milepost}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={Icons.size.xbig}
              color={Colors.secondarySharp}
              style={styles.rowIcon}
            />
          </>
        )}
        <Text style={[styles.draggableCardText, { flex: 6 }]}>{data.name}</Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={Icons.size.xbig}
          color={Colors.secondarySharp}
          style={styles.rowIcon}
        />
        <Text
          style={[
            styles.draggableCardText,
            { flex: 2, color: actionTimeColor },
          ]}
        >
          {moment(data.created_at).format(Formats.displayHourFormat)}
        </Text>
      </View>
    </DraxView>
  );
};

const StatusColumn = ({ data, onItemDropped }) => {
  const dispatch = useDispatch();

  const { name, rows } = data;
  const userStatusColumnData = Object.values(User.statusMap).find(
    ({ title }) => title === name
  );

  if (!userStatusColumnData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <DraxView
        style={styles.receivingZone}
        receivingStyle={styles.receiving}
        renderContent={({ viewState }) => {
          const receivingDrag = viewState && viewState.receivingDrag;
          const payload = receivingDrag && receivingDrag.payload;
          const shouldRenderDraggedCard =
            payload &&
            payload.statusAttributeName !== userStatusColumnData.attributeName;
          return (
            <View style={styles.mainColumnContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.columnTitle}>{name}</Text>
                <Text style={[styles.columnTitle, styles.addIcon]}>
                  {userStatusColumnData.attributeName === 'signedOut' ? (
                    <MaterialCommunityIcons
                      name="plus-circle"
                      size={Icons.size.xxxbig}
                      color={Colors.secondary}
                      style={{ marginTop: 30 }}
                      onPress={() =>
                        dispatch(handleAddUserToLog(NavigationActions))
                      }
                    />
                  ) : (
                    ''
                  )}
                </Text>

                <Text style={styles.columnTitle}>
                  {userStatusColumnData.secondaryTitle}
                </Text>
              </View>
              <View style={styles.scrollableScreenContainer}>
                <ScrollableScreen
                  nestedScrollEnabled
                  containerStyle={{ paddingTop: 0, paddingBottom: 0 }}
                >
                  {shouldRenderDraggedCard ? (
                    <DraggableCard
                      data={payload}
                      possibleStatusAttributeName={
                        userStatusColumnData.attributeName
                      }
                    />
                  ) : null}
                  <FlatList
                    data={rows}
                    listKey={moment().valueOf().toString()}
                    renderItem={({ item }) => (
                      <DraggableCard key={item.id} data={item} />
                    )}
                  />
                </ScrollableScreen>
              </View>
            </View>
          );
        }}
        onReceiveDragDrop={(event) => {
          const payload = event.dragged.payload;
          const shouldTriggerAction = !rows.find(({ id }) => id === payload.id);
          if (shouldTriggerAction) {
            onItemDropped(payload, userStatusColumnData.verb);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
  },
  mainColumnContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleContainer: {
    width: '100%',
    height: 34,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingBottom: 10,
    borderBottomColor: Colors.borderLightGrey,
    borderBottomWidth: 1,
  },
  scrollableScreenContainer: {
    width: '100%',
    height: 195,
  },
  columnTitle: {
    flex: 4,
    color: Colors.black,
    fontWeight: '500',
    marginLeft: 5,
    fontSize: Fonts.size.big,
    textAlign: 'center',
  },
  addIcon: {
    marginTop: -5,
  },
  rowIcon: { flex: 1, paddingRight: 5 },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  receivingZone: {
    height: 240,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'white',
  },
  receiving: {
    borderColor: Colors.secondary,
    borderWidth: 2,
  },
  draggableCard: {
    flex: 1,
    height: 45,
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  draggableCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  draggableCardText: {
    fontSize: Fonts.size.small,
    color: Colors.black,
    textAlign: 'center',
  },
  dragging: {
    opacity: 0.2,
  },
  xxxxsmallText: {
    fontSize: Fonts.size.xxxxsmall,
  },
  xxxsmallText: {
    fontSize: Fonts.size.xxxsmall,
  },
  xxSmallText: {
    fontSize: Fonts.size.xxsmall,
  },
});

export default StatusColumn;
