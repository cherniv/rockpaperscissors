import React, { Component } from 'react';
import { 
	View, 
	Text, 
	Image,
	StyleSheet,
	Dimensions, 
    ScrollView,
	TouchableWithoutFeedback as TouchableElement,
    ActivityIndicator,
} from 'react-native';
import Levels from '../services/LevelsService'
import px from '../utils/PixelSizeFixer'
import {BUTTON_PRESS} from 'actions';
import Button from 'components/Button';
import {levelSuccess as styles} from 'styles';
import Background from 'components/Background'
import Topbar from 'components/Topbar'
import LevelsManager from '../models/LevelsManager'
import LeaderboardItem from 'components/LeaderboardItem';
import * as firebase from 'firebase';
import Auth from 'services/Auth'
import Dispatcher from 'dispatcher'
var ActionTypes =  require('actions/ActionTypes');
import UserLevelResultFormatter from 'utils/UserLevelResultFormatter';
import t from 'utils/i18n' 

class LevelSuccess extends Component {
	constructor(props) {
		super(props);
		var params = this.params = this.props.navigation.state.params;
		
	}

	render() {
		var params = this.props.navigation.state.params;
		console.log('params', params)
		var time = LevelsManager.getDiffAverageTime(params.diff);

		var title = LevelsManager.getDiffTitle(params.diff);
		var nextDiff = LevelsManager.getNextDiff(params.diff);
		var buttonProps;
		if (nextDiff) {
			buttonProps = {
				onPressAction: BUTTON_PRESS.START_DIFFICULTY,
				text: t.t('difficultySuccess.nextMode'),
				icon: "controller-play",
			}
		} else {
			buttonProps = {
				onPressAction: BUTTON_PRESS.START_GAME,
				text: t.t('difficultySuccess.replay'),
				icon: "ccw",
			}
		}
		return (
			<Background>
				<View style={styles.container}>
					<Topbar title={t.t('difficultySuccess.title', {diff: title}).toUpperCase()} />
					<View style={[styles.label, styles.mainSublabel]}>
						<Text style={styles.mainSublabelText}>
							{t.t('difficultySuccess.yourAverageTimeIs', {time: UserLevelResultFormatter.toLocaleString(time)})}
						</Text>
					</View>
					<Button 
				        {...buttonProps}
				        onPressData={{diff: nextDiff, id: params.id+1}}
				        iconSize="18" 
				        style={styles.nextButton}
				        textStyle={styles.nextButtonText}
				    />
					<View style={[styles.label, styles.mainSublabel, styles.mainSublabelAfterButton]}>
						<CurrentLeader diff={params.diff} lastTime={time} />
					</View>
				    <Button 
				        onPressAction={BUTTON_PRESS.DIFFICULTY_HIGHSCORE}
		                onPressData={{diff: params.diff}}
				        text={'Highscore'}
				        icon="trophy"
				        iconSize="16" 
				        style={styles.highscoreButton}
				        textStyle={styles.highscoreButtonText}
				    />
				    {!nextDiff && <View style={[styles.label, styles.mainSublabel, styles.mainSublabelAfterButton]}>
						<Text style={styles.mainSublabelText}>
							{t.t('difficultySuccess.gameSuccess')}
						</Text>
					</View>}
				    
			    </View>
			</Background>
		)
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
		var {diff, lastTime} = this.props;
		firebase.database().ref('highscore-difficulties/' + diff ).orderByValue().limitToFirst(1).once('value').then(highscore => {
			highscore = highscore.val();
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
				{t.t('difficultySuccess.currentLeaderIs')}
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
						{t.t('difficultySuccess.currentLeaderIsYou')}
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