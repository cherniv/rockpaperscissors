'use strict';
import React from 'react';
import {
	View,
	Text,
	StyleSheet,
} from 'react-native';
import px from '../utils/PixelSizeFixer';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import EntypoFont from 'react-native-vector-icons/Fonts/Entypo.ttf';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import MaterialCommunityIconsFont from 'react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import MaterialIconsFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import EvilIconsFont from 'react-native-vector-icons/Fonts/EvilIcons.ttf';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import IoniconsFont from 'react-native-vector-icons/Fonts/Ionicons.ttf';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesomeFont from 'react-native-vector-icons/Fonts/FontAwesome.ttf';
import Feather from 'react-native-vector-icons/dist/Feather';
import FeatherFont from 'react-native-vector-icons/Fonts/Feather.ttf';

const STYLES = [
	{
		fontFamily: "MaterialCommunityIcons",
		src: MaterialCommunityIconsFont,
	},
	{
		fontFamily: "Entypo",
		src: EntypoFont,
	},
	{
		fontFamily: "MaterialIcons", 
		src: MaterialIconsFont,
	},
	{
		fontFamily: "EvilIcons",
		src: EvilIconsFont,
	},
	{
		fontFamily: "Ionicons",
		src: IoniconsFont,
	},
	{
		fontFamily: "FontAwesome",
		src: FontAwesomeFont,
	},
	{
		fontFamily: "Feather",
		src: FeatherFont,
	},
];

const createStyle = function(settings) {
	const fontFace = `@font-face {
		font-family: ${settings.fontFamily};
	  	src: url(${settings.src});
	}`;
	const style = document.createElement('style');
	style.type = 'text/css';
	if (style.styleSheet) {
	  style.styleSheet.cssText = fontFace;
	} else {
	  style.appendChild(document.createTextNode(fontFace));
	}
	document.head.appendChild(style);
}
STYLES.forEach(createStyle)

export default class Icon extends React.Component {
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
		if ( family == 'MaterialCommunityIcons' ) {
			Icon = MaterialCommunityIcons;
		} 
		if ( family == 'EvilIcons' ) {
			Icon = EvilIcons;
		}
		if ( family == 'Ionicons' ) {
			Icon = Ionicons;
    }
    if ( family == 'FontAwesome' ) {
			Icon = FontAwesome;
		}
    if ( family == 'Feather' ) {
			Icon = Feather;
		}
		return (
			<Icon style={this.props.style} name={this.props.name} size={px(this.props.size)} color={this.props.color || "#ffffff"} key={this.props.name} />
		);
	}
}

var styles = StyleSheet.create({
	
});
