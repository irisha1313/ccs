import React, { useState, useEffect } from 'react';
import { NavigationActions } from 'react-navigation';
import { useDispatch } from 'react-redux';

import { Colors, Fonts } from '../../constants';
import { ScrollableScreen, FsText } from '../../components/CustomComponents';
import IndividualOptionEntry from '../../components/IndividualOptionEntry';
import Screen from '../../components/Screen';

const MultipleOptionSelectionScreen = (props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(false);
  const [currentValue, setCurrentValue] = useState('');
  const [options, setOptions] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const receivedTitle = props.navigation.getParam('title');
    const receivedDescription = props.navigation.getParam('description');
    const receivedCurrentValue = props.navigation.getParam('currentValue');
    const receivedOptions = props.navigation.getParam('options');
    setTitle(receivedTitle);
    setDescription(receivedDescription);
    setCurrentValue(receivedCurrentValue);
    setOptions(receivedOptions);
  });

  const handleOptionSelection = (newValue) => {
    const onChange = props.navigation.getParam('onChange');
    onChange(newValue);
  };

  return (
    <Screen
      title={title}
      style={{ backgroundColor: Colors.lightGreyBackground }}
    >
      <ScrollableScreen
        containerStyle={{
          paddingTop: 30,
          backgroundColor: Colors.lightGreyBackground,
        }}
      >
        {options.map((option, optionKey) => (
          <IndividualOptionEntry
            key={optionKey}
            selected={currentValue === option}
            value={option}
            onPress={() => {
              handleOptionSelection(option);
              dispatch(NavigationActions.back());
            }}
          />
        ))}
        {description ? (
          <FsText
            style={{
              paddingTop: 10,
              color: Colors.secondaryDark,
              fontSize: Fonts.size.small,
              paddingHorizontal: 15,
            }}
          >
            {description}
          </FsText>
        ) : null}
      </ScrollableScreen>
    </Screen>
  );
};

// Exports
export default MultipleOptionSelectionScreen;
