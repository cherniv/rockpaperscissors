'use strict';

import React from 'react';

import {
	View,
	Text,
	Share,
	StyleSheet,
} from 'react-native';

import px from 'utils/PixelSizeFixer';
import Device from 'utils/Device';
import {navbar as styles} from 'styles';
import Button from 'components/Button';
import {BUTTON_PRESS} from 'actions';
import * as firebase from 'firebase';
var Dispatcher = require('dispatcher/AppDispatcher');
var ActionTypes =  require('actions/ActionTypes');
import LocalStorage from 'utils/LocalStorage'
import t from 'utils/i18n' 

class Navbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {blinkHelpButton: false}
	}

	render() {
		return (
			<View style={styles.container} >
				<Button 
					vertical={true}
		            onPressAction={BUTTON_PRESS.HOME}
		            text={t.t('navbar.home')}
		            icon="home"
		            iconSize="14" 
		            style={styles.button}
		            textStyle={styles.buttonText}
		        />
		        <Button 
					vertical={true}
		            onPress={this.share}
		            text={t.t('navbar.share')}
		            icon="favorite"
		            family="MaterialIcons"
		            iconSize="14" 
		            style={styles.button}
		            textStyle={styles.buttonText}
		        />
		        <Button 
					vertical={true}
		            onPressAction={BUTTON_PRESS.PROFILE}
		           	text={t.t('navbar.you')}
		            icon="face"
		            family='MaterialIcons'
		            iconSize="14" 
		            style={styles.button}
		            textStyle={styles.buttonText}
		        />
		        <Button 
					vertical={true}
		            onPressAction={BUTTON_PRESS.SETTINGS}
		            text={t.t('navbar.settings')}
		            icon="settings"
		            family="MaterialIcons"
		            iconSize="14" 
		            style={styles.button}
		            textStyle={styles.buttonText}
		        />
		        <Button 
		        	pointerFrom='top'
		        	blinking={this.state.blinkHelpButton}
					vertical={true}
		            onPressAction={BUTTON_PRESS.HELP}
		            text={t.t('navbar.help')}
		            icon="help"
		            iconSize="14" 
		            style={styles.button}
		            textStyle={styles.buttonText}
		        />
		       
		    </View>
		);
	}

	componentDidMount() {
		this.loadShareLinks();
		this.dispatchToken = Dispatcher.register(this.eventsHandler);
	}

	componentWillUnmount() {
		if (this.dispatchToken) Dispatcher.unregister(this.dispatchToken);
	}

	eventsHandler = (action) => {
    var data = action.data;
	  switch(action.type) {
	  	case ActionTypes.BUTTON_PRESS.HELP:
	  		this.setState({blinkHelpButton: false});
	  		LocalStorage.setItem('helpButtonUsed', 'true');
	  	break; 
	  	case ActionTypes.BUTTON_PRESS.START_LEVEL: 
	  		if (!data) return;
	  		if (data.id != 0) return;
	  		LocalStorage.getItem('helpButtonUsed').then((data)=>{
	  			if (data != 'true')
	  				this.setState({ blinkHelpButton: true })
	  		});
	  	break;
	  }
	}

	loadShareLinks() {
		firebase.database()
			.ref('share/').once('value')
			.then(val => {
				val = val.val();
				this.setState({
					androidShareUrl: val.android,
					iosShareUrl: val.ios,
				})
			})
	}

	share = () => {
		var title = 'Inviting Friends To RPS Puzzle Game App'
		
		var {androidShareUrl, iosShareUrl} = this.state;
		var message = "Hi, I've invited you to the RPS Puzzle game app." 
			+ " Download it for iPhone: " + iosShareUrl 
			+ " Download it for Android: " + androidShareUrl; 
		if (Device.isAndroid) message += ' ' + androidShareUrl; // RN Share for android has no 'url'
		Share.share({
			title,
			message,
			url: iosShareUrl
		}).then((response)=>console.log('Share response:', response))
	}
}

module.exports = Navbar;