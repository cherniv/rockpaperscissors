'use strict';

import React from 'react';

import {
	View,
	Text,
	Image,
	StyleSheet,
	TextInput,
	ActivityIndicator,
} from 'react-native';

import px from 'utils/PixelSizeFixer';
import UserpicUploader from 'utils/UserpicUploader';
import Topbar from 'components/Topbar';
import Background from 'components/Background';
import Icon from 'components/Icon';
import Auth from 'services/Auth';
import LevelsManager from '../models/LevelsManager'
import Flag from 'react-native-flags';
import * as firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob'
import Button from 'components/Button';
import ActionTypes, {BUTTON_PRESS} from 'actions';
import Dispatcher from 'dispatcher'
var ImagePicker = require('react-native-image-picker');
import t from 'utils/i18n' 

class UserPage extends React.Component {
	constructor(props) {
		super(props);
		var params = this.params = this.props.navigation.state.params || {};
		this.state = {
			checkingForUserpic: true, 
			username: params.username || Auth.getDisplayName(), 
			flag: params.flag || Auth.getFlag(),
			userId: params.userId || (Auth.getUser() && Auth.getId()),
		}
		this.loadUserpic();
		this.loadUserData();
		this.registerForEventsListening();
	}

	componentDidMount() {
		if (!this.isMe() ) return;

		var completedLevelsCount = LevelsManager.getCompletedLevelsCount();

		completedLevelsCount = completedLevelsCount || t.t('profilePage.zeroLevels') ;
		this.setState({completedLevelsCount});
	}

	loadUserData() {
		var userId = this.state.userId;
		if (!this.isMe()) {
		firebase.database().ref('users/' + userId ).once('value')
			.then(data => {
				data = data.val();
				this.setState({completedLevelsCount: data.completedLevelsCount || 0})
			})
		}
	}

	loadUserpic = () => {
		this.checkCustomUserpic()
	        .then(userpicUrl => {
	        	this.setState({userpicUrl, checkingForUserpic: false})
	        })
       		.catch((e)=>{
       			this.checkDefaultUserpic()
			        .then(userpicUrl => {
			        	this.setState({userpicUrl, checkingForUserpic: false})
			        })
		       		.catch((e)=>{
		       			this.setState({checkingForUserpic: false})
		      		})
      		})
	   
	}

	checkCustomUserpic = () => {
		return this.checkUserpic('custom.png')
	}

	checkDefaultUserpic = () => {
		return this.checkUserpic('provider.png')
	}

	checkUserpic = (url) => {
		var ref;
		var storage = firebase.storage();
		var storageRef = storage.ref();
		ref = storageRef.child('users/' + (this.state.userId || Auth.getId()) + '/' + url);
		return ref.getDownloadURL();
	}

	renderUserpic() {
		var el;
		if (this.state.checkingForUserpic) {
			el = <ActivityIndicator color={'#ffffff'} />
		} else if (this.state.userpicUrl) {
			el = <Image source={{uri: this.state.userpicUrl, width: px(100), height: px(100)}}
					style={styles.userpicImage}
				 	resizeMode='cover' 
				 />
		} else {
			el = <Icon name="tag-faces"
        			family='MaterialIcons'
        			style={{fontSize: px(60),  color: '#ffffff'}}
        		/>
		}

		el = (<View style={styles.userpic}>
				{el}
			</View>)

		if (this.isMe()) el = (
			<Button 
		        onPress={this.onPressEditUserpic}   
		    >{el}</Button>
			)


		var btn = this.isMe() && (
			<Button 
		        onPress={this.onPressEditUserpic}
		        dir='icon-text'
		        icon="settings"
    			family="MaterialIcons"
		        iconSize="10" 
		        style={styles.button}
		        textStyle={styles.buttonText}
		    />
			)

		el = (
			<View style={styles.userpicAndButton}>
				{el}
				{btn}
			</View>
		);

		return el;
	}	

	renderUsername() {
		var el ;

		var btn = this.isMe() && (
			<Button 
		        onPress={this.onPressEditUsername}
		        dir='icon-text'
		        icon="settings"
    			family="MaterialIcons"
		        iconSize="10" 
		        style={styles.button}
		        textStyle={styles.buttonText}
		    />
			)

		el = (
			<View style={styles.usernameAndButton}>
					{this.state.usernameEditing && 
					<TextInput style={styles.usernameTextInput} 
						value={this.state.username}
						ref='usernameRef'
						onBlur={this.onUsernameBlur}
						onChangeText={this.onUsernameChanged}
						onEndEditing={this.onUsernameEndEditing}
						multiline={false}
						maxLength={30}
						underlineColorAndroid='transparent'
					/>
					}
					{!this.state.usernameEditing && 
						<Text style={styles.usernameText} onPress={this.onPressEditUsername}>
							{this.state.username}
						</Text>
					}
				{btn}
			</View>
		)


		return el;
	}

	onUsernameEndEditing = () => {
		var usernameToStore = this.state.username;
		usernameToStore = usernameToStore.replace('http://www', '')
		usernameToStore = usernameToStore.replace('https://www', '')
		usernameToStore = usernameToStore.replace('http://', '')
		usernameToStore = usernameToStore.replace('https://', '')
		usernameToStore = usernameToStore.replace('HTTP://', '')
		usernameToStore = usernameToStore.replace('HTTPS://', '')
		usernameToStore = usernameToStore.replace('Http://', '')
		usernameToStore = usernameToStore.replace('Https://', '')

		this.checkIfUserIsLoggedIn(()=>{
			Auth.updateUsername(usernameToStore)
		})
	}

	onUsernameBlur = () => {
		this.setState({usernameEditing: false});
		this.onUsernameEndEditing();
	}

	onUsernameChanged = (val) => {
		this.setState({username: val});
	}

	onPressEditUsername = () => {
		if (!this.state.usernameEditing)
		this.setState({usernameEditing: true}, () =>
			this.refs.usernameRef.focus()
		);
		else {
			//this.refs.usernameRef.blur()
		this.setState({usernameEditing: false});
		//onSubmitEditing
		this.onUsernameEndEditing();
	}

	}

	renderCompletedNumber() {
		var el;
		var c = this.state.completedLevelsCount;
		if (isNaN(c) && !this.isMe()) el = <ActivityIndicator color={'#ffffff'} />
		else el = <Text style={styles.levelsPassedCountText} >{c}</Text>
		return el;
	}

	isMe() {
		var userId = this.state.userId;
		return !userId || userId == Auth.getId();
	}

	renderFlag() {

		var {flag} = this.state;
		var hasFlag = flag && flag != 'undefined'

		var el = (
			<View style={styles.flagWrapper}>
			<View style={styles.flagContainer} >
				<Button 
		        onPressAction={BUTTON_PRESS.CUSTOMIZE_FLAG}
		        onPressData={{flag}}
		    	>
				<Flag code={flag} style={styles.flag} key='flag' />
				</Button>
			</View>
			</View>
		)

		var btn = (
			<Button 
		        onPressAction={BUTTON_PRESS.CUSTOMIZE_FLAG}
		        onPressData={{flag}}
		       // text={hasFlag ? null : 'Choose Flag'}
		        dir='icon-text'
		        icon="settings"
    			family="MaterialIcons"
		        iconSize="10" 
		        style={styles.button}
		        //style={hasFlag ? styles.button : styles.buttonFirstTime}
		        textStyle={styles.buttonText}
		    />
		)

		if (this.isMe()) {
			el = (
				<View style={styles.flagAndButtonWrapper}>
					{el}
					{btn}
				</View>
			)
		}

		return el;
	}

	onFlagChange(flag) {
		this.setState({flag});
	}

	renderLoginLabel() {
		if (!Auth.getUser().isAnonymous) {
			return null
		}
		return (
			<View style={styles.loginMotivation}>
						<Text style={styles.loginMotivationText} >Log in and you will be able to customize your userpic and name!</Text>
						
					</View>
		)
	}

	onPressEditUserpic = () => {

		this.setState({
      	checkingForUserpic: true,
    	});

		// More info on all the options is below in the README...just some common use cases shown here
var options = {
  title: 'Select Avatar',
  quality: 0.8,
  cameraType: 'front',
  mediaType: 'photo',
  allowsEditing: true,
  //customButtons: [
    //{name: 'fb', title: 'Choose Photo from Facebook'},
  //],
  // storageOptions: {
  //   skipBackup: true,
  //   path: 'images'
  // }
};

/**
 * The first arg is the options object for customization (it can also be null or omitted for default options),
 * The second arg is the callback which sends object: response (more info below in README)
 */
ImagePicker.showImagePicker(options, (response) => {
  //console.log('Response = ', response);

  if (response.didCancel) {
    console.log('User cancelled image picker');
    	this.setState({checkingForUserpic: false,});
  }
  else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
    this.setState({checkingForUserpic: false,});
  }
  else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
  }
  else {
	this.checkIfUserIsLoggedIn(() => {
		UserpicUploader.uploadCustomUserpic(response, Auth.getId())
			.then(this.loadUserpic)
	})
  }
});
	}

	checkIfUserIsLoggedIn = (cb) => {
    	if (!Auth.getUser()) {
    		Auth.signInAnonymously().then(cb);
    	} else {
    		cb();
    	}
	}


	render() {
		return (
			<Background>
				<Topbar title={this.isMe() ?  t.t('profilePage.yourProfile') : t.t('profilePage.playerProfile')  } />
				<View style={styles.container}>
					{this.renderUserpic()}
					{this.renderUsername()}
					{this.renderFlag()}
					<View style={styles.levelsPassedLabel}>
						<Text style={styles.levelsPassedText} >{t.t('profilePage.levelsCompleted')}</Text>
						{this.renderCompletedNumber()}
					</View>
					{/*this.renderLoginLabel()*/}
				</View>
			</Background>
		);
	}

	eventsHandler = (action) => {
    var data = action.data;
	  switch(action.type) {
	  	case BUTTON_PRESS.FLAG_CHOSEN: 
	  		this.onFlagChange(data.flag);
	  	break;
	  }
	}

	registerForEventsListening() {
		this.dispatchToken = Dispatcher.register(this.eventsHandler);
	}

	componentWillUnmount() {
		Dispatcher.unregister(this.dispatchToken);
	}
}

var styles = require('styles').profilePage;

module.exports = UserPage;