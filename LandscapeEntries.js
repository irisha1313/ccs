import React, { useState } from 'react';
import { View } from 'native-base';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '../../../../constants';
import { FsText } from '../../../../components/CustomComponents';
import LandscapeLogEntry from '../../../../components/SafeClear/LandscapeLogEntry';

const LandscapeEntries = () => {
  const { currentLog } = useSelector((state) => ({
    currentLog: state.safeClear.currentLog.data,
    loadingCurrentLog: state.safeClear.currentLog.loading,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FsText style={[styles.headerTitle, { flex: 1.2 }]}></FsText>
        <FsText style={[styles.headerTitle, { marginLeft: -5 }]}>Type</FsText>
        <FsText style={styles.headerTitle}>Identifier</FsText>
        <FsText style={styles.headerTitle}>Track</FsText>
        <FsText style={[styles.headerTitle, { flex: 2.5 }]}>Restriction</FsText>
        <FsText style={[styles.headerTitle, { flex: 4.5 }]}>
          Direction Traveling
        </FsText>
        <FsText style={styles.headerTitle}>In</FsText>
        <FsText style={[styles.headerTitle, { flex: 1.5 }]}>Notes</FsText>
      </View>
      <LandscapeLogEntry
        isNewEntry
        logId={currentLog.id}
        usersSignedIn={Boolean(currentLog.signedIn?.length)}
      />
      {currentLog.entries?.map((entry) => (
        <LandscapeLogEntry key={entry.id} entry={entry} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: Colors.white,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  headerTitle: {
    flex: 2,
    alignItems: 'center',
    textAlign: 'center',
    color: Colors.black,
    fontWeight: '500',
    fontSize: Fonts.size.big,
  },
});

export default LandscapeEntries;
