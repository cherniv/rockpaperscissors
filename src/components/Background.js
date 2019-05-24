'use strict';

import React from 'react';

import {
	View,
	Text,
	ImageBackground,
	StyleSheet,
} from 'react-native';

import px from '../utils/PixelSizeFixer';
import Dispatcher from '../dispatcher'
import ActionTypes from '../actions';
import LocalStorage from '../utils/LocalStorage'
import Settings from '../services/Settings'
import image from '../assets/images/texture/tex12.jpg'

var styles = {};

export default class Background extends React.PureComponent {
	state = {brightness: Settings.getBrightness()}
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.setState({mounted: true});
	}

	render() {
		return (
			<ImageBackground 
		        resizeMode='cover' 
		        source={image}
		        defaultSource={image}
		        style={styles.container}
		        key='background'
		        resizeMethod='scale'
		      >
		       <View style={[styles.brightnessOverlay, {backgroundColor: 'rgba(0,0,0,' + (1-this.state.brightness) + ')'}]}>
			      {this.state.mounted && 
			      	<View style={styles.innerContainer}> 
			      		{this.props.children}
			      	</View>
			      }
		   		</View>
		    </ImageBackground>
		);
	}

	eventsHandler = (action) => {
    var data = action.data;
	  switch(action.type) {
	  	case ActionTypes.SETTINGS.BRIGHTNESS_CHANGED:
	  		var val = data.val;
	  		this.setState({brightness: val});
	  	break;
	  }
	}

	componentDidMount() {
		this.dispatchToken = Dispatcher.register(this.eventsHandler);
	}

	componentWillUnmount() {
		Dispatcher.unregister(this.dispatchToken);
	}
}

module.exports = Background;