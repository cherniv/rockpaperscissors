import React, { Component } from 'react';
import { 
	View, 
	Text, 
	Image,
	StyleSheet,
	Dimensions, 
    ScrollView,
    ActivityIndicator,
	TouchableWithoutFeedback as TouchableElement,
} from 'react-native';
import Levels from '../services/LevelsService'
import px from '../utils/PixelSizeFixer'
import {BUTTON_PRESS} from 'actions';
import Button from 'components/Button';
import {levelSuccess as styles} from 'styles';
import Background from 'components/Background'
import LevelsManager from '../models/LevelsManager'
import * as firebase from 'firebase';
import LeaderboardItem from 'components/LeaderboardItem';
import Topbar from 'components/Topbar';
import Auth from 'services/Auth'
import Dispatcher from 'dispatcher'
var ActionTypes =  require('actions/ActionTypes');
import UserLevelResultFormatter from 'utils/UserLevelResultFormatter';
import t from 'utils/i18n' 

class LevelSuccess extends Component {
	constructor(props) {
		super(props);
		this.state = {}
		var params = this.params = this.props.navigation.state.params;
		LevelsManager.getDiff(params.diff).then(diff => {
          var isLastInDiff = ( params.id + 1 == diff.length);
          var bestTime = diff[params.id].time || this.params.time;
          this.setState({isLastInDiff, bestTime})
        })
        this.registerForEventsListening();
	}

	render() {
		if (this.state.shutdown) return null;
		var params = this.params;
		var {time} = params;
		var bestTime = this.state.bestTime || time;
		var isLastInDiff = this.state.isLastInDiff;
		return (
			<Background>
				<View style={styles.container}>
					<Topbar title={t.t('levelSuccess.title', {level: (params.id+1)})} noback />
					<Button 
				        onPressAction={isLastInDiff ? BUTTON_PRESS.DIFFICULTY_SUCCESS : BUTTON_PRESS.START_LEVEL}
				        onPressData={{diff: params.diff, id: params.id+1}}
				        text={isLastInDiff ? t.t('levelSuccess.next') : t.t('levelSuccess.nextLevel')}
				        icon="controller-play"
				        iconSize="18" 
				        style={styles.nextButton}
				        textStyle={styles.nextButtonText}
				    />
				    <View style={[styles.label, styles.mainSublabel, styles.mainSublabelAfterButton]}>
						<Text style={styles.mainSublabelText}>
							{t.t('levelSuccess.yourTimeIs', {time: UserLevelResultFormatter.toLocaleString(time)})}
						</Text>
						<Text style={styles.sublabelText}>
							{t.t('levelSuccess.yourBestTimeIs', {time: UserLevelResultFormatter.toLocaleString(bestTime)})}
						</Text>
					</View>
					<Button 
				        onPressAction={BUTTON_PRESS.RESTART_LEVEL}
				        onPressData={{diff: params.diff, id: params.id}}
				        text={t.t('levelSuccess.restartButton')}
				        icon="ccw"
				        iconSize="10" 
				        style={styles.highscoreButton}
				        textStyle={styles.highscoreButtonText}
				    />
					<View style={[styles.label, styles.mainSublabel, styles.mainSublabelAfterButton]}>
						<CurrentLeader diff={params.diff} id={params.id} lastTime={params.time} />
					</View>
				    <Button 
				        onPressAction={BUTTON_PRESS.LEVEL_HIGHSCORE}
				        onPressData={{diff: params.diff, id: params.id}}
				        text={t.t('levelSuccess.highscoreButton')}
				        icon="trophy"
				        iconSize="10" 
				        style={styles.highscoreButton}
				        textStyle={styles.highscoreButtonText}
				    />

			    </View>
			</Background>
		)
	}

	componentWillUnmount() {
		if (this.dispatchToken) Dispatcher.unregister(this.dispatchToken);
	}

	// HACK FOR CLEANING OLD ROUTES FROM REACT NAVIGATION STACK
  	eventsHandler = (action) => {
    var data = action.data;
	  switch(action.type) {
	  	case ActionTypes.ROUTER.ROUTE_CHANGED: 
	  		//console.log('ROUTE_CHANGED', data);
	  		var {currentRoute} = data;
	  		if (!currentRoute) return;
	  		var {routeName, params} = currentRoute;
	  		if (!routeName || !params ) return;
	  		if (routeName == 'LEVEL_SUCCESS' && (params.diff != this.params.diff || params.id != this.params.id)) {
	  			this.setState({shutdown: true});
	  			Dispatcher.unregister(this.dispatchToken);
	  			delete this.dispatchToken;
	  			//console.log('SHUTTING DOWN LEVEL SUCCESS', this.params.diff, this.params.id)
	  		}
	  	break;
	  }
	}

  	registerForEventsListening() {
	this.dispatchToken = Dispatcher.register(this.eventsHandler);
	}
}

class CurrentLeader extends Component {
	state = {}
	
	componentWillMount() {
		this.load();
	}

	onFlagChange(flag) {
		setTimeout(this.load, 500);
	}

	load = () => {
		var {diff, id, lastTime} = this.props;
		firebase.database().ref('highscore-levels/' + diff + '/' + id + '' ).orderByValue().limitToFirst(1).once('value').then(highscore => {
			highscore = highscore.val();
			if (!highscore) return;
			var leaderId = Object.keys(highscore)[0];
			var score = highscore[leaderId]
			firebase.database().ref('users/' + leaderId ).once('value').then(leader => {
				var {flag, displayName} = leader.val();
				if (score > lastTime) {
					// sometimes cloud function is not gfast enough if record was just bitten 
					// so need to load once gain to get real result
					this.load();
				} else {
					this.setState({flag, leaderId, displayName, score});

					// if user decides to update his flag we need to be prepared
					// to replace the flag in real time
					if (Auth.getId() == leaderId) this.registerForEventsListening()
				}
			});
		})
	}

	render() {
		var {flag, leaderId, displayName, score} = this.state;
		var el = [
			<Text style={styles.mainSublabelText} key='k1'>
				{t.t('levelSuccess.currentLeaderIs')}
			</Text>
		];
		
		if (!score) {
			el.push(
				<View style={styles.currentLeaderWrapper} key='k2'>
				<ActivityIndicator color='#ffffff' />
				</View>
			);
		} else {
			if (leaderId == Auth.getId()) {
				el.push(
					<Text style={styles.mainSublabelText} key='k3'>
						{t.t('levelSuccess.currentLeaderIsYou')}
					</Text>
				);
			}

			el.push(
				<View style={styles.currentLeaderWrapper} key='k4'>
					<LeaderboardItem flag={flag} userId={leaderId} displayName={displayName} score={score} index={0}  />
				</View>
			)
		}

		return (
			<View>
				{el}
			</View>
		)
	}

	eventsHandler = (action) => {
    var data = action.data;
	  switch(action.type) {
	  	case BUTTON_PRESS.FLAG_CHOSEN: 
	  		this.onFlagChange(data.flag);
	  	break;
	  }
	}

	componentWillUnmount() {
		this.dispatchToken && Dispatcher.unregister(this.dispatchToken);
	}

	registerForEventsListening() {
		if (!this.dispatchToken) this.dispatchToken = Dispatcher.register(this.eventsHandler);
	}
}

module.exports = LevelSuccess;