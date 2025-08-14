import React from 'react';
import { View } from 'native-base';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';

import { FsText } from '../CustomComponents';
import { Fonts, Colors } from '../../constants';
import { Formats } from '../../constants/SafeClear';

const Note = ({ createdAt, note }) => {
  const { logTimezone, loadingCurrentLog } = useSelector((state) => ({
    logTimezone: state.safeClear.currentLog.data.timezone,
    loadingCurrentLog: state.safeClear.currentLog.loading,
  }));

  if (loadingCurrentLog) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: 20,
        borderBottomColor: Colors.borderLightGrey,
        borderBottomWidth: 2,
      }}
    >
      <FsText
        style={{
          fontSize: Fonts.size.big,
          fontWeight: 'bold',
        }}
      >
        {logTimezone
          ? moment(createdAt)
              .tz(logTimezone)
              .format(Formats.displayFullDateFormatWithTimezone)
          : ''}
      </FsText>
      <FsText
        style={{
          paddingVertical: 10,
          marginLeft: 20,
          fontSize: Fonts.size.normal,
        }}
      >
        {note}
      </FsText>
    </View>
  );
};

export default Note;
