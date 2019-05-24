import Device from '../utils/Device';
import Dispatcher from '../dispatcher';
import ActionTypes from '../actions';
import LocalStorage from '../utils/LocalStorage';
//import React from 'react';
import firebase from 'firebase/app';
import "firebase/database";
import {firebaseConfig as config} from '../secrets.js'
//import NetInfo from '../utils/NetInfo'

var resolve;
var readiness_promise = new Promise(function(_resolve, reject) {
  resolve = _resolve;
});


var database;

class FirebaseService {
	constructor() {
		this.dispatchToken = Dispatcher.register(this.eventsHandler.bind(this));
		this.loggedIn = false;
		this.initializeApp();
	}

	initializeApp = () => {
    var app = firebase.initializeApp(config);
		database = firebase.database();
		//this.signout();
		this.listenForAuthStateChange();//
		//firebase.database.enableLogging(true);
		resolve(true);

		this.doAdminStuff() 
	}

	saveUserData = (child, data) => {

		return this.userRef().child(child).set(data)
	}

	getUserData = (child) => {
		if (child)
			return this.userRef().child(child);
		else 
			return this.userRef();
	}
 
	doAdminStuff() {
		
		
		
	}

	userRef() {
		if (!this._userRef) this.setUserRef();
		return this._userRef;
	}

	setUserRef() {
		if (!firebase.auth().currentUser) {
			console.log('Setting UserRef for user failed:', firebase.auth().currentUser);
		} else {
			this._userRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
		}
	}

	listenForAuthStateChange() {
		firebase.auth().onAuthStateChanged(user => {

		  if (user) {
		  	this.loggedIn = true; 
		  	this.setUserRef();
		  	//this.setUserData(5555)
		  } else {
		  	this.loggedIn = false; 
		  	//this.signInAnonymously();
		  }

		  Dispatcher.dispatch({
				type: ActionTypes.APP.FIREBASE_AUTH_STATE_CHANGE,
				data: {user}
  		});

		});
	}

	isLoggedIn() {
		return this.loggedIn;
	}

	isFirebaseReady() {
		return readiness_promise;
	}

	
	getCurrentUser() {
		return firebase.auth().currentUser;
	}

	_signInWithCredentialsSuccess(data, data2) {
		console.log('_signInWithCredentialsSuccess', data, data2);
  	}

  	signout() {
  		LocalStorage.removeItem('firebase')
  		firebase.auth().signOut();
  	}

	eventsHandler(action) {
		//console.log("Navbar eventsHandler", action);
		return;
	  	switch(action.type) {
		    case ActionTypes.APP.MAIN_COMPONENT_DID_MOUNT:
		    	//this.loadKeys();
		    break;
		    case ActionTypes.USER.GOOGLE_LOGIN_SUCCESS:
		    	if (!Device.isWeb) // On web the login flow is united
		    		this.googleLogin(action.data)
		    break;
		    case ActionTypes.USER.FACEBOOK_LOGIN_SUCCESS:
		    	if (!Device.isWeb) // On web the login flow is united
		    		this.facebookLogin(action.data);
		    break;
		    case ActionTypes.APP.USER_NOT_FOUND:
		    case ActionTypes.APP.USER_WITH_FAILED_TOUR_FOUND:
		    case ActionTypes.USER.SIGNOUT:
		    	this.signout();
		    break;
		    default:
		}
	}

	exportLevelsToFirebase() {
		var levels = require('../levels');
		//console.log(levels.easy)
		 var order = 0;
		for (var diff in levels) {
			var levelsRef = database.ref('levels');
			for (var i = 0, len = levels[diff].length; i < len; i ++) {
				var l = levels[diff][i];
				console.log('L', l)
				levelsRef.child(diff).child(i).child('width').set(l.width);
				levelsRef.child(diff).child(i).child('fighter').set(l.fighter);
				for (var c = 0; c < l.cells.length; c ++ ) {
					if (l.cells[c].active == undefined) l.cells[c].active = false
					levelsRef.child(diff).child(i).child('cells').child(c).child('active').set(l.cells[c].active);
					if (l.cells[c].fighter) {
						levelsRef.child(diff).child(i).child('cells').child(c).child('fighter').set(l.cells[c].fighter);
					}
				}
			}
		}

		//var diff = 'easy';

		

		// firebase.database().ref('difficulties').orderByChild('order').on('value' , data=>{
		// //	console.log('DAT', data.val())
		// })
	}
}

export default new FirebaseService;