import React from "react";
import { View, Text } from 'react-native';

const Badge = ({ value, status }) => (
  <View style={{ backgroundColor: '#2487d2', borderRadius: 24, paddingHorizontal: 6 }}>
    <Text style={{ color: 'white' }}>{value}</Text>
  </View>
);

export default Badge;
