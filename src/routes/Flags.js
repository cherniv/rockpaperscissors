import React, { Component } from 'react';
import { 
	View, 
	Text, 
	Image,
	FlatList,
	StyleSheet,
    ScrollView,
    InteractionManager,
	TouchableHighlight as TouchableElement,
	ActivityIndicator,
} from 'react-native';
import px from '../utils/PixelSizeFixer'
import {BUTTON_PRESS} from '../actions';
import Dispatcher from '../dispatcher'
import Button from '../components/Button';
import {flags as styles} from '../styles';
import Background from '../components/Background'
import Auth from '../services/Auth'
import Topbar from '../components/Topbar'
import Flag from 'react-native-flags';
import * as _flags from '../../node_modules/react-native-flags/flags';
var flags = Object.keys(_flags.flat.icons);
import t from '../utils/i18n' 

class Flags extends Component {

	state = {}

	constructor(props) {
		super(props);
		this.registerForEventsListening();
	}

	componentDidMount() {
		this.setState({
			flag: Auth.getFlag(),
		});
		setTimeout(()=>
			this.setState({
				mounted: true,
			})
		)
	}

	onFlagChange(flag) {
		this.setState({flag});	
	}

	_keyExtractor = (item, index) => {
		return item;
	}

	render() {
		var params = this.params;
		return (
			<Background>
				<View style={styles.container}>
					<Topbar title='CHOOSE A FLAG' />
					<View style={[styles.title]}>
						<Text style={styles.titleText}>{t.t('flags.current')}</Text>
						<View style={styles.flagContainer} >
							 <Flag code={this.state.flag} style={styles.flag} key='flag' />
						</View>
					</View>
					
						<View style={styles.listWrapper}>
							{this.renderList()}
						</View>
					
			    </View>
			</Background>
		)
	}

	renderItem = ({item}) => {
		return <FlagWrapper code={item} />
	}

	renderList() {
		if (!this.state.mounted) return <ActivityIndicator color='#ffffff' />;

		return (
			<FlatList
				numColumns={5}
		        data={flags}
		        contentContainerStyle={styles.list}
		        //extraData={this.state}
		        keyExtractor={this._keyExtractor}
		        renderItem={this.renderItem}
		    />
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

	registerForEventsListening() {
		this.dispatchToken = Dispatcher.register(this.eventsHandler);
	}
	componentWillUnmount() {
		Dispatcher.unregister(this.dispatchToken);
	}

}

class FlagWrapper extends React.PureComponent {
	state = {ready: false}
	componentDidMount() {
		//InteractionManager.runAfterInteractions(() => {
		this.setState({ready: true})
	//})
	}
	render() {
		var flag = this.props.code;
		var el;
		if (this.state.ready) {
			el = <Flag code={flag} style={styles.flag} key='flag' />
		}
		return (
			<Button 
					onPressAction={BUTTON_PRESS.FLAG_CHOSEN}
		        	onPressData={{flag}}
		        	style={styles.item}
		        	key={'flagWrapper'+flag}
				>
					{el}
				</Button>
		)
	}
}


module.exports = Flags;