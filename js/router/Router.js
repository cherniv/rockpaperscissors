import React from 'react';
import {NavigatorComponent, NavigationActions} from 'navigator/Navigator';
var Dispatcher = require('dispatcher/AppDispatcher');
var ActionTypes =  require('actions/ActionTypes');
import LevelsManager from '../models/LevelsManager'
//var LoginStore = require('stores/LoginStore')
import SplashScreen from 'react-native-splash-screen'
import Device, {width, height} from 'utils/Device'
import NetInfo from 'utils/NetInfo'
import LocalStorage from 'utils/LocalStorage'
import {KEYS} from 'router/Router.config';
var navigator, currentRoute, prevRoute; 

var levelPassed = 0;

export default class Router extends React.Component {
  
  static back(key) {  back(key); }

	constructor(props){
		super(props);
		this.registerForEventsListening();
	}

  onNavigationStateChange = (oldState, newState) => {
    currentRoute = newState.routes[newState.index];
    prevRoute = oldState.routes[oldState.index];
    setTimeout(()=>
      Dispatcher.dispatch({
        type: ActionTypes.ROUTER.ROUTE_CHANGED,
        data: {currentRoute, prevRoute}
      })
    )
    storeLastRouteOnDevice(currentRoute);
  }

  render() {
    return (
      <NavigatorComponent
        onInit={nav => { Device.isMobile ? navigator = nav : nav}  } // On mobile NavigatorComponent is not ReactNavigation Navigator
        ref={nav => { Device.isWeb ? navigator = nav : nav} }        // On mobile NavigatorComponent is customized ReactNavigation Navigator
        onNavigationStateChange={this.onNavigationStateChange} 
        />
    )
  }



	eventsHandler(action) {
		//console.log('ACTION', action)
    var data = action.data;
	  switch(action.type) {
      case ActionTypes.APP.FIREBASE_AUTH_STATE_CHANGE:
        SplashScreen && SplashScreen.hide();
        break;
      case ActionTypes.BUTTON_PRESS.HOME:
        gotoMainRoute(KEYS.HOME);
        break;
      case ActionTypes.AUTH.LOGIN_ANONYMOUSLY:
      case ActionTypes.AUTH.UPGRADE_SUCCESS:
      case ActionTypes.BUTTON_PRESS.START_GAME:
        if (!currentRoute || currentRoute.routeName == KEYS.HOME)
      	   go(KEYS.DIFFICULTIES_MENU);
      	break;
      case ActionTypes.BUTTON_PRESS.START_DIFFICULTY:
        //var difficultyLevelsRouteInStack = findRouteByName(KEYS.LEVELS);
        //if (difficultyLevelsRouteInStack) 
        //  backTo(difficultyLevelsRouteInStack);
        //else 
      	  go(KEYS.LEVELS, data);
      	break;
      case ActionTypes.BUTTON_PRESS.START_LEVEL:
      case ActionTypes.BUTTON_PRESS.RESTART_LEVEL:
        go(KEYS.LEVEL, data);
        break;
      case ActionTypes.GAME.LEVEL_SUCCESS:
        if (NetInfo.isConnected() && ++levelPassed % 4 == 0 && data.id >= 5) 
          go(KEYS.AD_PREPARE, data);
        else
          go(KEYS.LEVEL_SUCCESS, data);
        break;
      case ActionTypes.ADS.FINISHED:
        reset(KEYS.LEVEL_SUCCESS, data);
        break;
      case ActionTypes.BUTTON_PRESS.DIFFICULTY_SUCCESS:
        go(KEYS.DIFFICULTY_SUCCESS, data);
        break;
      case ActionTypes.BUTTON_PRESS.LEVEL_HIGHSCORE:
        go(KEYS.LEADERBOARD_LEVEL, data);
        break;
      case ActionTypes.BUTTON_PRESS.DIFFICULTY_HIGHSCORE:
        go(KEYS.LEADERBOARD_DIFFICULTY, data);
        break;
      case ActionTypes.BUTTON_PRESS.SETTINGS:
        gotoMainRoute(KEYS.SETTINGS);
        break;
      case ActionTypes.BUTTON_PRESS.CUSTOMIZE_FLAG:
        go(KEYS.FLAGS);
        break;
      case ActionTypes.BUTTON_PRESS.HELP:
        gotoMainRoute(KEYS.HELP);
        break;
      case ActionTypes.BUTTON_PRESS.HIGHSCORE_ITEM:
        go(KEYS.PROFILE, data);
        break;
      case ActionTypes.BUTTON_PRESS.PROFILE:
        gotoMainRoute(KEYS.PROFILE);
      	break;
      case ActionTypes.APP.ANDROID_BACK_BUTTON_PRESS:
        if(!canSwipeBack(currentRoute)) return;
      case ActionTypes.BUTTON_PRESS.BACK:
          back();
        break;
 


	    default:
	      // do nothing
	  }
	}

	registerForEventsListening() {
		this.dispatchToken = Dispatcher.register(this.eventsHandler);
	}
}


// HELPERS
// HELPERS
// HELPERS

var reset = function(routeName, params) {
  const resetAction = NavigationActions.reset({
    index: 1,
    actions: [
      NavigationActions.navigate({ routeName: KEYS.HOME}),
      NavigationActions.navigate({ routeName, params}),
    ]
  })
  navigator && navigator.dispatch(resetAction)


}

var go = function(routeName, params, shouldRememberRoute = false, routeConfig ){
  
  const navigateAction = NavigationActions.navigate({
    routeName,
    params,
    type: NavigationActions.NAVIGATE
  })

  navigator && navigator.dispatch(navigateAction);
}

var back = function(key) {
  if (navigator.state.nav.routes.length > 1)
    navigator && navigator.dispatch(NavigationActions.back({key}));
  else {
    gotoMainRoute(KEYS.HOME);
  }
}

var backTo = function(route) {
  if (route && currentRoute && route.key != currentRoute.key) {
    var nextRoute = findNextRouteInStack(route.key);
    back(nextRoute.key);
  }
}

var gotoMainRoute = function(key) {
  var routeInStack = findRouteByName(key);
  if (routeInStack && (!routeInStack.params || Object.keys(routeInStack.params).length == 0))
    backTo(routeInStack);
  else 
    go(key);
}

var canSwipeBack = function() {
  //return !checkCurrentRouteName(KEYS.HOME);
}  

var findRouteByName = function(routeName) {
  var route = navigator.state.nav.routes.filter(route=>route.routeName == routeName);
  //console.log('navigator', route)
  return route.length ? route[0] : null;
}

var findNextRouteInStack = function(routeKey) {
  var nav = navigator.state.nav;
  if (!routeKey) routeKey = nav.routes[nav.index].key;
  var route;
  var index = nav.routes.findIndex(i => i.key == routeKey);
  if (index >= 0 && index < nav.routes.length) {
    route = nav.routes[index + 1];
  }

  return route;
}

var storeLastRouteOnDevice = function(currentRoute) {
  setTimeout(()=>
  LocalStorage.setItem('lastRoute', JSON.stringify(currentRoute))
  ,1000)
}
