import React, { Component } from 'react';
import { 
	View, 
	Text, 
	Image,
	StyleSheet,
	Dimensions, 
    ScrollView,
    FlatList,
	TouchableWithoutFeedback as TouchableElement,
} from 'react-native';
import Levels from '../services/LevelsService'
import px from '../utils/PixelSizeFixer'
import {BUTTON_PRESS} from '../actions';
import Button from '../components/Button';
import Icon from '../components/Icon';
import Item from '../components/LeaderboardItem';
import {leaderboard as styles} from '../styles';
import LevelsManager from '../models/LevelsManager'
import * as firebase from 'firebase';
import Dispatcher from '../dispatcher'

class Leaderboard extends Component {

	state = {
		items: []
	}

	constructor(props) {
		super(props);
		var params = this.params = this.props;
		this.itemsEndpoint = firebase.database().ref('users');
		this.registerForEventsListening();
	}

	onFlagChange(flag) {
		this.setState({flag});
		setTimeout(this.load, 500);
	}

	componentWillMount() {
		this.load();
	} 

	load = () => {
 		var {diff, id} = this.params;
 		var ref;
 		if (!isNaN(id)) {
 			ref = firebase.database().ref('highscore-levels/' + diff + '/' + id )
 		} else {
 			ref = firebase.database().ref('highscore-difficulties/' + diff )
 		}

		ref.orderByValue().once('value')
			.then(ids => {
				var items = [];
				var selectedKeyIndex = -1;
				ids.forEach(record => {
				 	items.push({userId: record.key, score: record.val()});
				 	this.itemsEndpoint.child(record.key).once('value').then(userData => {
				 		userData = userData.val();
				 		var item = this.state.items.find(item => item.userId == record.key);
				 		item.flag = userData.flag;
				 		item.displayName = userData.displayName;
				 		this.setState({items});
				 	});
				 	if (record.key == this.params.selectedKey)
				 		selectedKeyIndex = items.length - 1; 
				})
				this.setState({items});
				selectedKeyIndex >= 0 && setTimeout(()=>this.refs.list.scrollToIndex({index:selectedKeyIndex, viewPosition: 0.5}), 500);
			})
	}

	renderItem = (item) => {
		var {flag, userId, displayName, score} = item.item;
		var selected = this.props.selectedKey == userId;
		return <Item flag={flag} userId={userId} displayName={displayName} score={score} index={item.index} selected={selected} />
	}

	_keyExtractor = (item, index) => item.userId;

	render() {
		var params = this.params;
		//if (!this.state.items.length) return null;
		return (
			
				<View style={styles.container}>
					<FlatList
						ref='list'
						extraData={this.state}
						data={this.state.items}
						renderItem={this.renderItem}
						keyExtractor={this._keyExtractor}
						onScrollToIndexFailed={()=>{}}
						//getItemLayout={(data, index) => {
				       //   var length = px(32);
				       //   return {length, offset: length * index, index};
				        //}}
						//onEndReached={()=>console.log('ONEND')}
					/>
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
		Dispatcher.unregister(this.dispatchToken);
	}

	registerForEventsListening() {
		this.dispatchToken = Dispatcher.register(this.eventsHandler);
	}
}


module.exports = Leaderboard;