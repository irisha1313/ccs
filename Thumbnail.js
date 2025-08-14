import React from 'react';
import { Image } from 'react-native';

export default ({ style, source, ...rest }) => (
  <Image
    style={{
      ...style,
    }}
    source={{
      uri: source.uri ? source.uri : source,
    }}
    {...rest}
  />
);
