'use strict';

import React from 'react';

import {
	View,
	Text,
  Image,
	StyleSheet,
} from 'react-native';

import px from 'utils/PixelSizeFixer';
import {levelTopbar as styles} from 'styles';
import Button from 'components/Button';
import {BUTTON_PRESS} from 'actions';
import FightersService from 'services/FightersService'
import Icon from 'components/Icon';
import LevelsManager from '../models/LevelsManager'
import t from 'utils/i18n' 


class Topbar extends React.Component {
	constructor(props) {
		super(props);
    this.state={currentTime: this.props.currentTime, blinkRestartButton: false}
	}

  componentWillReceiveProps(props) {
    this.setState({currentTime: props.currentTime})
    if (props.blinkRestartButton != this.state.blinkRestartButton) {
      this.setState({blinkRestartButton: props.blinkRestartButton})
    }
  }

  renderHintButton() {
    var el;
    var props = this.props.onPressHint ? {
      onPress: this.props.onPressHint,
      icon: "lock"
    } : {
      customIcon: (
       FightersService.getImage(this.props.hint, styles.hintIconImage)
      )
    }
   
    el = (
      <Button 
        key='hintbtn'
        vertical={true}
        //text={'Hint'}
        iconSize="14" 
        style={styles.button}
        textStyle={styles.buttonText}
        {...props}
        nounderlay
      >
        {!this.props.onPressHint && <Icon family='MaterialCommunityIcons' name='crown' style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          top: 0,
          textAlign: 'center',
        }} />}
      </Button>
    )
     
    return el;
  }

	render() {
		var diff = this.props.diff;
		var diffLabel = LevelsManager.getDiffTitle(diff);
		var levelTotalIndex = LevelsManager.getLevelTotalIndex(diff, this.props.level);
    return (
			<View style={styles.container} >
				<Button 
					vertical={true}
          onPressAction={BUTTON_PRESS.START_DIFFICULTY}
          onPressData={{diff}}
          text={diffLabel}
          icon="grid"
          iconSize="14" 
          style={styles.button}
          textStyle={styles.buttonText}
      	/>
      	<Button 
					vertical={true}
          onPress={this.props.onPressRestart}
          text={t.t('levelTopbar.restart')}
          icon="ccw"
          iconSize="14" 
          style={styles.button}
          textStyle={styles.buttonText}
          pointerFrom='bottom'
          blinking={this.state.blinkRestartButton}
      	/>
      	<View style={styles.middleSection}>
          {/*<Text style={styles.levelLabel}>Level: {levelTotalIndex}</Text>*/}
          <LevelTimer time={this.state.currentTime} />
      	</View>
      	<Button 
					vertical={true}
          onPress={this.props.onPressUndo}
          text={t.t('levelTopbar.undo')}
          icon="back"
          iconSize="14" 
          style={styles.button}
          textStyle={styles.buttonText}
      	/>
        {this.renderHintButton()}
			</View>
		);
	}
}

var MAX_TIME = 59 * 60 + 59 ;

class LevelTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state={time: this.props.time || 0}
  }

  componentWillReceiveProps(props) {
    this.setState({time: props.time})
  }

  render() {
    var time  = Math.floor(this.state.time / 1000);
    time = time >= MAX_TIME ? MAX_TIME : time;
    var secs = time % 60;
    var mins = Math.floor(time / 60);
    mins = (mins <= 9 ? '0' : '') + mins;
    secs = (secs <= 9 ? '0' : '') + secs;
    time = mins + ':' + secs;
    return (
      <View style={styles.timer}>
        <Icon family="Feather" name="clock" style={styles.clockIcon} />
        <Text style={styles.timerText}>{time}</Text>
      </View>
    )
  }
}

module.exports = Topbar;