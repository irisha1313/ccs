import React, { useState, useEffect, memo } from 'react';
import { View } from 'react-native';
import { Spinner } from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment-timezone';

import { Colors } from '../constants';

const ActiveDatesCalendar = ({ activeDatesInUTC, onClickDay }) => {
  const [customDatesStyles, setCustomDatesStyles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateStyledDates();
  }, []);

  useEffect(() => {
    updateStyledDates();
  }, [activeDatesInUTC]);

  const updateStyledDates = () => {
    setLoading(true);
    const styledActiveDates =
      activeDatesInUTC &&
      activeDatesInUTC.length &&
      activeDatesInUTC.map((date) => ({
        date: moment(date),
        style: {
          backgroundColor: Colors.primaryDark,
        },
        textStyle: { color: 'white' },
        allowDisabled: true,
      }));

    setTimeout(function () {
      if (styledActiveDates) {
        setCustomDatesStyles(styledActiveDates);
      }
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spinner color={Colors.secondary} />
      </View>
    );
  }

  const DSToffsetCorrections = {
    '-04:00': 240,
    '-05:00': 120,
  };

  // console.log(customDatesStyles, 'customDatesStyles');

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white, marginTop: 40 }}>
      <CalendarPicker
        todayTextStyle={{ fontWeight: 'bold' }}
        todayBackgroundColor={'transparent'}
        selectedDayStyle={{
          backgroundColor: 'unset',
          fontWeight: 'unset',
          color: 'unset',
        }}
        customDatesStyles={customDatesStyles}
        onDateChange={(selectedDate) => {
          onClickDay(selectedDate.format('YYYY-MM-DD'));
        }}
      />
    </View>
  );
};

export default memo(ActiveDatesCalendar, (prevProps, nextProps) => {
  const result =
    prevProps.activeDatesInUTC.join() === nextProps.activeDatesInUTC.join();
  return result;
});
