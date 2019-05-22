import React, { Component } from 'react';
import { 
	View, 
	Text, 
	Image,
	StyleSheet,
	Dimensions, 
    ScrollView,
    FlatList,
	TouchableHighlight as TouchableElement,
} from 'react-native';
import {leaderboardItem as styles} from 'styles';
import Icon from 'components/Icon';
import px from '../utils/PixelSizeFixer'
import Flag from 'react-native-flags';
import UserLevelResultFormatter from 'utils/UserLevelResultFormatter';
var Dispatcher = require('dispatcher/AppDispatcher');
var ActionTypes =  require('actions/ActionTypes');

class Item extends Component {

	constructor(props) {
		super(props);
		this.state = {
			userId: props.userId,
			flag: props.flag,
			username: props.displayName,
			score: props.score,
		}
	}

	componentWillReceiveProps(props) {
		this.setState({
			flag: props.flag,
			username: props.displayName,
		})
	}

	onPress = () => {
		//console.log('USER PRESS',this.state.userId)
		var {userId, username, flag} = this.state;
		Dispatcher.dispatch({
			type: ActionTypes.BUTTON_PRESS.HIGHSCORE_ITEM,
			data: {userId, username, flag}
		})
	}

	render() {

		var el;
		var flag;

		flag = this.state.flag || 'unknown';

		var trophy;
		var {index} = this.props;
		if (index < 3) {
			var color = ['#FFD700', '#c0c0c0', '#cd7f32'];
			trophy = <View style={styles.positionIcon}><Icon style={styles.transparent} name='trophy' size={px(12 - index)} color={color[index]} /></View>
		}

		return (
			<TouchableElement 
				style={styles.touchableWrapper} 
				onPress={this.onPress} 
				underlayColor='rgba(255,255,255,0.05)'
			>
				<View style={[styles.itemContainer, this.props.selected && styles.selectedItemContainer]}>
					<View style={styles.positionContainer}>
						{trophy}
					</View>
					<View style={styles.scoreContainer}>
						<Text style={styles.scoreText}>{UserLevelResultFormatter.toLocaleString(this.props.score)}</Text>
					</View>
					<View style={styles.flagContainer} key='flagWrapper'>
						<Flag code={flag} style={styles.flag} key='flag' />
					</View>
					<View style={styles.usernameContainer}>
						<Text style={styles.usernameText}>{this.state.username}</Text>
					</View>
				</View>
			</TouchableElement>
		)
	}
}

module.exports = Item;