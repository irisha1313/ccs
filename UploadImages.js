import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Colors, Icons } from '../constants';
import {
  FsButton,
  FsButtonActionIcon,
  FsText,
  FsAlert,
} from './CustomComponents';
import Thumbnail from './Thumbnail';

const UploadImages = ({ onImagesUpdate, currentImages = [] }) => {
  const handleImageAddition = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      FsAlert.alertOk(
        'Camera Roll Permission',
        'Permission to your camera roll is required to add images'
      );
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.2,
    });
    if (!result.cancelled && onImagesUpdate) {
      onImagesUpdate([...currentImages, result.uri]);
    }
  };

  return (
    <>
      <FsButtonActionIcon
        title=""
        style={{
          alignItems: 'center',
          alignContent: 'center',
          marginHorizontal: 10,
          borderRadius: 10,
          marginTop: 20,
          backgroundColor: Colors.secondarySharp,
        }}
        onPress={handleImageAddition}
        renderIcon={(color) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons
              name="plus"
              color={color}
              size={Icons.size.normal}
            />
            <FsText style={{ color: Colors.textLight, paddingHorizontal: 8 }}>
              ADD AN IMAGE
            </FsText>
          </View>
        )}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
          marginTop: 10,
        }}
      >
        {currentImages.map((picture, renderedPictureIndex) => {
          return (
            <View
              style={{
                display: 'flex',
                width: 150,
                marginTop: 10,
              }}
              key={picture}
            >
              <FsButton
                style={{
                  alignSelf: 'flex-end',
                  minWidth: 5,
                  zIndex: 1,
                  position: 'absolute',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderColor: 'transparent',
                  borderRadius: 20,
                  right: 5,
                }}
                onPress={() => {
                  const newCurrentImages = currentImages.filter(
                    (currentPicture, currentPictureIndex) =>
                      currentPictureIndex !== renderedPictureIndex
                  );
                  onImagesUpdate(newCurrentImages);
                }}
              >
                <FontAwesome
                  name="trash"
                  color={Colors.red}
                  size={Icons.size.small}
                />
              </FsButton>
              <Thumbnail
                style={{
                  width: 150,
                  height: 150,
                  paddingHorizontal: 5,
                  borderRadius: 20,
                }}
                source={picture}
              />
            </View>
          );
        })}
      </View>
    </>
  );
};

export default UploadImages;
