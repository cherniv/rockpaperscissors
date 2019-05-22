'use strict';

import React from 'react';

import {
	View,
	Text,
	StyleSheet,
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import px from 'utils/PixelSizeFixer';

export default class IconComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var family = this.props.family;
		var Icon;
		if ( !family || family == 'Entypo' ) {
			Icon = Entypo;
		} 
		if ( family == 'MaterialIcons' ) {
			Icon = MaterialIcons;
		} 
		if ( family == 'Ionicons' ) {
			Icon = Ionicons;
		}
		if ( family == 'EvilIcons' ) {
			Icon = EvilIcons;
		}
		if ( family == 'Octicons' ) {
			Icon = Octicons;
		}
		if ( family == 'Feather' ) {
			Icon = Feather;
		}
		if ( family == 'FontAwesome' ) {
			Icon = FontAwesome;
		}
		if ( family == 'MaterialCommunityIcons' ) {
			Icon = MaterialCommunityIcons;
		}

		return (
			<Icon style={this.props.style} name={this.props.name} size={px(this.props.size)} color={this.props.color || "#ffffff"} key={this.props.name} />
		);
	}
}

var styles = StyleSheet.create({
	
});
