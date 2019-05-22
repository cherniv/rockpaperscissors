import React, { Component } from 'react';
import { 
	View, 
	Text, 
	Image,
	StyleSheet,
	Dimensions, 
    ScrollView,
    FlatList,
    Linking,
    Slider,
    Switch,
	TouchableHighlight as TouchableElement,
} from 'react-native';
import px from '../utils/PixelSizeFixer'
import ActionTypes, {BUTTON_PRESS} from 'actions';
import Button from 'components/Button';
import {settings as styles} from 'styles';
import Background from 'components/Background'
import Auth from '../services/Auth'
import Topbar from 'components/Topbar'
import Dispatcher from 'dispatcher'
import LocalStorage from 'utils/LocalStorage'
import Settings from 'services/Settings';
import t from 'utils/i18n' 

class SettingsComponent extends Component {

	state = {}

	constructor(props) {
		super(props);
	}

	render() {
		var params = this.params;
		return (
			<Background>
				<Topbar title={t.t('settings.title')} />
				<ScrollView style={styles.container}>
					<View style={styles.item}>
						<View style={styles.title}>
							<Text style={styles.titleText}>{t.t('settings.backgroundBrightness')}</Text>
						</View>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<BrightnessPicker />
						</View>
					</View>
					<View style={[styles.item, styles.inlineItem]}>
						<View style={styles.title}>
							<Text style={styles.titleText}>{t.t('settings.music')}</Text>
						</View>
						<MusicSwitch />
					</View>
					<View style={[styles.item, styles.inlineItem]}>
						<View style={styles.title}>
							<Text style={styles.titleText}>{t.t('settings.animations')}</Text>
						</View>
						<AnimationsSwitch />
					</View>
					<View style={styles.item}>
						<View style={styles.title}>
							<Text style={styles.titleText}>{t.t('settings.contactUs')}</Text>
						</View>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<Button 
						        onPress={()=>Linking.openURL('mailto:contact@bioludus.com')}
						        //text={'contact@bioludus.com'}
						        dir='icon-text'
						        icon="mail"
		            			family="MaterialIcons"
						        iconSize="20" 
						        style={styles.contactButton}
						        //textStyle={styles.buttonText}
						    />
						    <Button 
						        onPress={()=>Linking.openURL('https://www.facebook.com/Rock-Paper-Scissors-Puzzle-387387228384620/')}
						        //text={'contact@bioludus.com'}
						        dir='icon-text'
						        icon="logo-facebook"
						        iconSize="20" 
						        family='Ionicons'
						        style={[styles.contactButton, styles.facebook]}
						        //textStyle={styles.buttonText}
						    />
						    <Button 
						        onPress={()=>Linking.openURL('https://plus.google.com/u/1/communities/108951669463320145388')}
						        //text={'contact@bioludus.com'}
						        icon="logo-googleplus"
						        iconSize="20" 
						        family='Ionicons'
						        style={[styles.contactButton, styles.google]}
						        //textStyle={styles.buttonText}
						    />
						</View>
					</View>
			    </ScrollView>
			</Background>
		)
	}	
}


class BrightnessPicker extends React.Component {
	state = {brightness: Settings.getBrightness()}
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Slider 
				style={{flex: 1,}} 
				value={this.state.brightness}
				minimumTrackTintColor='#dddddd'
				maximumTrackTintColor='#ffffff'
				onValueChange={val=>{
					Dispatcher.dispatch({
						type: ActionTypes.SETTINGS.BRIGHTNESS_CHANGED,
						data: {val}
		  			});
				}}
				onSlidingComplete={val=>{
					Settings.setBrightness(val);
					this.setState({brightness: val})
				}}
			/>
		)
	}
}



class MusicSwitch extends React.Component {
	state = {musicAllowed: Settings.getMusicAllowed()}
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		//this.setState({musicAllowed});
	}

	render() {
		return (
			<Switch 
				//style={{flex: 1,}} 
				value={this.state.musicAllowed}
				onValueChange={val => {
					this.setState({musicAllowed: val});
					Settings.setMusicAllowed(val)
				}}
			/>
		)
	}
}


class AnimationsSwitch extends React.Component {
	state = {animationsAllowed: Settings.getAnimationsAllowed()}
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		//this.setState({musicAllowed});
	}

	render() {
		return (
			<Switch 
				//style={{flex: 1,}} 
				value={this.state.animationsAllowed}
				onValueChange={val => {
					this.setState({animationsAllowed: val});
					Settings.setAnimationsAllowed(val);
				}}
			/>
		)
	}
}


module.exports = SettingsComponent;