import React, { useState, useEffect } from 'react';
import { View, Modal, Animated } from 'react-native';
import * as Progress from 'react-native-progress';
import { Text } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

import { Colors } from '../constants';

const renderStatusPicture = (status) => {
  let iconName = 'picture-o';
  if (status.toLowerCase().includes('consent')) {
    iconName = 'handshake-o';
  } else if (
    status.toLowerCase().includes('complete') ||
    status.toLowerCase().includes('sent') ||
    status.toLowerCase().includes('finished')
  ) {
    iconName = 'check';
  } else if (status.toLowerCase().includes('initializing')) {
    iconName = 'list-alt';
  } else if (status.toLowerCase().includes('bug')) {
    iconName = 'bug';
  }

  return (
    <FontAwesome name={iconName} color={Colors.secondaryLight} size={100} />
  );
};

const LoadingModal = (props) => {
  const { visible, progress, status, spinning, continuousAnimation, icon } =
    props;

  const movementAnimation = new Animated.Value(0);
  const opactityAnimation = new Animated.Value(1);

  const animationTravelDistance = spinning ? 1 : -80;
  const animationStartPoint = 0;

  useEffect(() => {
    animateStatusPicture();
    animateStatusPictureOpacity();
  }, []);

  const animateStatusPicture = () => {
    movementAnimation.setValue(animationStartPoint);
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(movementAnimation, {
        toValue: animationTravelDistance,
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start((done) => {
      if (done) {
        animateStatusPicture();
      }
    });
  };

  const animateStatusPictureOpacity = (initialOpacity = 1) => {
    opactityAnimation.setValue(initialOpacity);
    const toValue = Number(!initialOpacity);
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(opactityAnimation, {
        toValue,
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start((done) => {
      if (done) {
        const newInitialOpacity = continuousAnimation
          ? toValue
          : initialOpacity;
        animateStatusPictureOpacity(newInitialOpacity);
      }
    });
  };

  const animationDirection = spinning
    ? {
        rotate: movementAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      }
    : { translateY: movementAnimation };

  return (
    <Modal visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 40,
          backgroundColor: 'white',
        }}
      >
        <Animated.View
          style={
            progress !== 1 && {
              opacity: opactityAnimation,
              transform: [animationDirection],
            }
          }
        >
          {icon || renderStatusPicture(status)}
        </Animated.View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ textAlign: 'center', paddingVertical: 10 }}>
            {status}
          </Text>
          <Progress.Bar
            color={Colors.secondary}
            indeterminate={progress === 'indeterminate'}
            progress={progress}
            width={200}
          />
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;
