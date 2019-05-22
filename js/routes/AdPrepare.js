import React, {Component} from 'react'
import {
	View,
	Text,
	Image
} from 'react-native';
import Icon from 'components/Icon'
import Background from 'components/Background'
import {adPrepare as styles} from 'styles'
import Device from 'utils/Device';
import px from 'utils/PixelSizeFixer';
import Dispatcher from 'dispatcher'
import ActionTypes from 'actions';
import Button from 'components/Button';
import t from 'utils/i18n' 

var config = require('../../private/admob')
var AdMobInterstitial;
var ADMOB = require('react-native-admob');
AdMobInterstitial = ADMOB.AdMobInterstitial;
if (Device.isIos) {
	AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId, "158ebe2dfebe17de5d3d6c15dce34e77"]);
} else {
	AdMobInterstitial.setTestDevices(["6245FF3880E1B6CC2E41B760FD304A68"]);
}
AdMobInterstitial.setAdUnitID(config[Device.OS] || 'ca-app-pub-9348624033828810/1811182490');
AdMobInterstitial.requestAd();

var showBanner = () => {
		if (!AdMobInterstitial) return;
		
		AdMobInterstitial.showAd();
		setTimeout(()=> // need this timeout for android
			AdMobInterstitial.requestAd()
		, 2000);
	}

class AdPrepare extends Component {
	state = {
		count: 3,
	}
	componentDidMount() {
		this.interval = setInterval(() => {
			if (this.state.count == 1) {
				clearInterval(this.interval);
				//
				showBanner();
				this.setState({shutdown: true});
				setTimeout(()=>{
					Dispatcher.dispatch({
						type: ActionTypes.ADS.FINISHED,
						data: this.props.navigation.state.params,
					})
				}, 50)
				
			} else 
				this.setState({count: this.state.count-1 });
		}, 1000); 
	}
	render() {
		if (this.state.shutdown) return null;
		return (
			<Background>
				<View style={styles.container}> 
					<View style={styles.label}>
						<Text style={styles.labelText}>{t.t('adPrepare.label')}</Text>
					</View>
					<Icon 
						style={styles.tvIcon}
						size={200} name='tv'  
					/>
					<Text style={styles.count}>{this.state.count}</Text>
					{/*<Button 
				        //onPressAction={BUTTON_PRESS.DIFFICULTY_HIGHSCORE}
		                //onPressData={{diff: params.diff}}
				        text={'Remove Ads'}
				        icon="trophy"
				        iconSize="16" 
				        style={styles.removeAdsButton}
				        textStyle={styles.removeAdsButtonText}
				    />*/}
				</View>
			</Background>
		)
	}
}

module.exports = AdPrepare;