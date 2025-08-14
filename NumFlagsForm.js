import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import _ from 'lodash';
import { Colors, Fonts, Icons } from '../constants';
import {
    FsText,
    FsButton,
} from './CustomComponents';


/**
 * @prop onPressMinusFlag
 * @prop onPressPlusFlag
 * @prop num_flags
 *
 */
const NumFlagsForm = props => {
    return (
        <View
            style={[
                { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
                props.containerStyle,
            ]}
        >
            <FsButton
                onPress={props.onPressMinusFlag}
                style={[
                    { borderWidth: 1, borderColor: Colors.divider },
                    { borderRadius: 24 },
                    { height: 48 },
                ]}
            >
                <MaterialCommunityIcons
                    name="minus"
                    size={Icons.size.normal}
                    color={Colors.secondary}
                />
            </FsButton>

            <FsText
                style={[
                    { fontWeight: 'bold' },
                    { fontSize: Fonts.size.big },
                    { marginLeft: 16 },
                ]}
            >
                {_.defaultTo(props.title, "Flags:")}
            </FsText>
            <FsText
                style={[
                    { fontWeight: 'bold' },
                    { fontSize: Fonts.size.big },
                    { marginLeft: 8 },
                    { marginRight: 16 },
                ]}
            >
                {props.num_flags}
            </FsText>
            <FsButton
                onPress={props.onPressPlusFlag}
                style={[
                    { borderWidth: 1, borderColor: Colors.divider },
                    { borderRadius: 24 },
                ]}
            >
                <MaterialCommunityIcons
                    name="plus"
                    size={Icons.size.normal}
                    color={Colors.secondary}
                />
            </FsButton>
        </View>
    );
};


export default NumFlagsForm;
