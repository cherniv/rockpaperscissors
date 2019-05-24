'use strict';

import {
  NetInfo,
} from 'react-native';

import Dispatcher from '../dispatcher';
import ActionTypes from '../actions';
import Device from '../utils/Device';
var isConnected;

var initialStatusFetch = NetInfo.fetch();
if (initialStatusFetch.done) { // For Mobile
	initialStatusFetch.done(_isConnected => {
	    isConnected = _isConnected;
	});
} else { // for Web
	isConnected = navigator.onLine;
}

// main component waits for resolving 
// net connection status to start the app
// @TODO to find a nicer way to resolve
var resolve;
var readiness_promise = new Promise(function(_resolve, reject) {
  resolve = _resolve;
});

var isIt = function(status) {
	var flag = (typeof status == 'boolean' && status) || (typeof status == 'string' && status.toLowerCase() != 'none')
	return flag;
}

var isUnknown = function(status) {
	// the last condition is especially for android when 
	// you are entering the app by pressing push notification
	return status == undefined || status == 'unknown' || status == 'UNKNOWN' || status == ''; 
}

var onlineStatusChanged = function(isConnected) {
	Dispatcher.dispatch({
		type: ActionTypes.APP.OFFLINE_CHANGE,
		data: {isConnected}
	});
}

var mobileStatusHasChanged = function(_isConnected){
	if (isUnknown(isConnected) && !isUnknown(_isConnected)) resolve(_isConnected);
	isConnected = isIt(_isConnected);
	onlineStatusChanged(isConnected);
}

var webStatusHasChanged = function() {
	onlineStatusChanged(navigator.onLine);
}

if (Device.isWeb) {
	resolve(true); 
	window.addEventListener('online',  webStatusHasChanged);
  	window.addEventListener('offline', webStatusHasChanged);
} else {
	NetInfo.addEventListener(
	    'change',
	    mobileStatusHasChanged
	);
} 

export default {
	isConnected: function() {
		return isIt(isConnected);
	},
	isNotConnected: function() {
		return !this.isConnected();
	},
	isUnknown: function() {
		return isUnknown(isConnected);
	},
	getInitialDetectionPromise(cb) {
		return readiness_promise;
	}
};