import React from 'react';
import {
  View,
  Modal,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { createStackNavigator, NavigationActions , StateUtils} from 'react-navigation';
//var Navbar = require('components/Navbar');
import {ROUTES, KEYS} from 'router/Router.config';
var styles = require('styles').navigator;
import Navbar from 'components/Navbar';
import LocalStorage from 'utils/LocalStorage';
import Settings from 'services/Settings';

//LocalStorage.removeItem('lastRoute')

var getLastRoute = () => {
	return LocalStorage.getItem('lastRoute').then(lastRoute => {
	    //console.log('SAVED ROUTE', lastRoute);
	    var initialRouteName, initialRouteParams;
	    if (!lastRoute) {
	      initialRouteName = KEYS.HOME;
	    } else {
	      lastRoute = JSON.parse(lastRoute);
	      if (lastRoute.routeName == KEYS.LEVEL) 
	      	lastRoute = {routeName: KEYS.LEVELS, params: {diff: lastRoute.params.diff}}
	      if (lastRoute.routeName == KEYS.PROFILE) 
	      	lastRoute = {routeName: KEYS.HOME}
	      initialRouteName = lastRoute.routeName;
	      initialRouteParams = lastRoute.params;
	    }

	    return createStackNavigator(ROUTES, {
		  headerMode: 'none',
		  cardStyle: styles.route,
		  initialRouteName,
		  initialRouteParams,
		  navigationOptions: {
		     gesturesEnabled: false,
		   },
		 transitionConfig : () => ({
		  	transitionSpec: {
		  		duration: 300,
		  		easing: Settings.getAnimationsAllowed() ? 
		  			Easing.out(Easing.poly(4)) : Easing.step0,
		  		useNativeDriver: true,
		  		timing: Animated.timing,
		  	},
		  }),
		})
  	})
}

class NavigatorComponent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {Component: null }
		getLastRoute().then(Navigator => this.setState({Navigator}));
	}

	render() {
		var {Navigator} = this.state;
		if (!Navigator) return null;
		return (
			<View style={styles.container}>
				<StatusBar
   					barStyle="light-content"
   				/>
		      <Navigator
		        ref={nav => {this.props.onInit(nav); } } 
		        onNavigationStateChange={this.props.onNavigationStateChange} />
		      <Navbar />
	    	</View>
	  	)
	}
}

export { NavigatorComponent, NavigationActions };
