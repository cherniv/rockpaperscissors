'use strict';

import React from 'react';

import {
	View,
	Text,
	StyleSheet,
} from 'react-native';

import px from '../utils/PixelSizeFixer';
import {BUTTON_PRESS} from '../actions';
import Button from '../components/Button';
import {topbar as styles} from '../styles';

export default class Topbar extends React.Component {
	constructor(props) {
		super(props);
	}

	renderBackButton() {
		if (this.props.noback || this.props.back == false) return null;
		return (
			<Button 
				vertical={true}
	            onPressAction={BUTTON_PRESS.BACK}
	            //text="Home"
	            family='Ionicons'
	            icon="md-arrow-round-back"
	            iconSize="12" 
	            style={styles.backButton}
	           // textStyle={styles.buttonText}
	        />
		)
	}

	renderHomeButton() {
		if (this.props.home != true) return null;
		return (
			<Button 
				vertical={true}
	            onPressAction={BUTTON_PRESS.HOME}
	            //text="Home"
	            //family='Ionicons'
	            icon="home"
	            iconSize="12" 
	            style={styles.backButton}
	           // textStyle={styles.buttonText}
	        />
		)
	}

	renderRightSpace() {
		if (this.props.noback) return null;
		return (
			<View style={styles.rightSpace} />
		)
	}

	render() {
		return (
			<View style={styles.container}>
				{this.renderBackButton()}
				{this.renderHomeButton()}
		        <Text style={styles.title}>{this.props.title}</Text>
		        {this.renderRightSpace()}
			</View>
		);
	}
}
