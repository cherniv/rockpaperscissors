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
    Share,
	TouchableHighlight as TouchableElement,
} from 'react-native';
import px from '../utils/PixelSizeFixer'
import ActionTypes, {BUTTON_PRESS} from '../actions';
import Button from '../components/Button';
import {sharing as styles} from '../styles';
import Background from '../components/Background'
import Topbar from '../components/Topbar'
import Dispatcher from '../dispatcher'
import t from '../utils/i18n' 
import * as firebase from 'firebase';
import Device from '../utils/Device';;

class SharingComponent extends Component {

	state = {}

	constructor(props) {
		super(props);
		this.loadShareLinks();
	 	this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  	}

	onNavigatorEvent = (event) => {
	    if (event.selectedTabIndex == 1) { // 1 is Sharing tab index
	      setTimeout(this.openShareActionSheet);
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

	openShareActionSheet = () => {
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

	render() {
		var params = this.params;
		return (
			<Background>
				<Topbar title={t.t('sharing.title')} backOnPressAction={BUTTON_PRESS.BACK_TO_GAME_TAB} />
				<ScrollView style={styles.container}>
					<View style={styles.item}>
						<View style={styles.title}>
							<Text style={styles.titleText}>{t.t('sharing.contactUs')}</Text>
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
					<View style={styles.item}>
						<View style={styles.title}>
							<Text style={styles.titleText}>{t.t('sharing.share')}</Text>
						</View>
						<Button 
					        onPress={this.openShareActionSheet}
					        //text={'contact@bioludus.com'}
					        dir='icon-text'
					        icon="share"
	            			family="MaterialIcons"
					        iconSize="20" 
					        style={styles.contactButton}
					        //textStyle={styles.buttonText}
					    />
					</View>
			    </ScrollView>
			</Background>
		)
	}	
}


module.exports = SharingComponent;
