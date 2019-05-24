import * as firebase from 'firebase';
import FirebaseService from './FirebaseService'
import LocalStorage from '../utils/LocalStorage'
//import {GoogleSignin} from 'react-native-google-signin';
//import RNFetchBlob from 'react-native-fetch-blob'
import t from '../utils/i18n' ;
import Dispatcher from '../dispatcher';
import ActionTypes from '../actions';
import {EventEmitter} from 'events';

var gud = FirebaseService.getUserData;
var sud = FirebaseService.saveUserData;

//const FBSDK = require('react-native-fbsdk');
// const {
//   LoginManager,
//   AccessToken,
//} = FBSDK;


//const Blob = RNFetchBlob.polyfill.Blob;
//window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
//		window.Blob = Blob
var localUserDataPromise = LocalStorage.getItem('userData');

class AuthService extends EventEmitter{
	constructor(props) {
		super(props)
		this.user = null;
		this.registerForEventsListening();
		this.loadUserData(); // here to load data asap
	}

	getDisplayName() {
		return this.userData && this.userData.displayName ? this.userData.displayName : t.t('auth.defaultDisplayName');
	}

	getUser() {
		return this.user;
	}

	getId() {
		return this.user ? this.user.uid : null; 
	}

	getFlag() {
		return this.userData ? this.userData.flag : 'undefined';
	}

	setFlag(flag) {
		if (!this.userData) this.userData = {}
		this.userData.flag = flag;
		sud('flag', flag);
		this.cacheUserDataOnDevice();
	}

	eventsHandler = (action) => {
    var data = action.data;
	  switch(action.type) {
	  	case ActionTypes.APP.FIREBASE_AUTH_STATE_CHANGE: 
	  		this.userAuthStateChange(data.user);
	  		break;
	  	case ActionTypes.BUTTON_PRESS.FLAG_CHOSEN: 
	  		var cb = () => this.setFlag(data.flag);
	  		if (!this.getUser())
	  			this.signInAnonymously().then(cb);
	  		else cb();
	  		break;
	  }
	}

	signInAnonymously(){
		return firebase.auth().signInAnonymously()
		.then(user => {
			//console.log('signInAnonymously user', user )
			
			Dispatcher.dispatch({
				type: ActionTypes.AUTH.LOGIN_ANONYMOUSLY,
			});

			if (!this.user) this.user = user;

			this.updateUsername(t.t('auth.defaultDisplayName'));

			return user;
		})
		.catch(error => {
		  // Handle Errors here.
		  console.log('signInAnonymously error', error )
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // ...
		});

	}

	updateUserData(userdata) {
		var {providerData} = userdata;
		console.log('UPDATING USER DATA', providerData);
		if (providerData) {
			providerData = providerData[0];
		  	this.updateUsername(providerData.displayName);
		  	this.updateEmail(providerData.email);
		  	//this.updatePhotoURL(providerData.photoURL);
		  	this.getUserpicFromProvider(providerData)
		}
	}

	getUserpicFromProvider(providerData) {
		const size = 400;
		var url;

		console.log('updateUserpic0>>>', providerData);
		console.log('updateUserpic00', providerData.providerId);

		var uid;

		if (providerData.providerId == 'facebook.com') {
			 url = "https://graph.facebook.com/" + providerData.uid + "/picture?height=" + size;
		} else if (providerData.providerId == 'google.com') {
			console.log('updateUserpic000', providerData.photoURL);
			url = providerData.photoURL;
			url += (url.indexOf('?') >= 0 ? '&' : '?') + 'size=' + size;
		}

		console.log('updateUserpic2', url);
		if (!url) return;
		

		var originalXMLHttpRequest = window.XMLHttpRequest;
		var originalBlob = window.Blob;
		window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
		window.Blob = Blob
		RNFetchBlob.fetch('GET', url, {
	  })
	  // when response status code is 200
	  .then((res) => {
	  	console.log('RES', res, res.blob())
	    res.blob().then(blob=>{
	    firebase.storage()
	        .ref('users/' + this.getId())
	        .child('provider.png')
	        .put(blob, { contentType : 'image/png' })
	        .then((snapshot) => {
	        	console.log('REALLY UPLOADED');
	        	sud('hasProviderUsepric', true);
	        })
	        .catch(error=>console.log('OR NOT', error))
	    })
	  })
	  // Status code is not 200
	  .catch((errorMessage, statusCode) => {
	    // error handling
	    console.log('EEERRROR:', errorMessage, statusCode)
	    window.XMLHttpRequest = originalXMLHttpRequest;
		window.Blob = originalBlob;
	  })
	}

	updateUsername(username) {
		sud('displayName', username);
		if (!this.userData) this.userData = {}
		this.userData.displayName = username;
		this.cacheUserDataOnDevice()
	}

	updateEmail(email) {
		sud('email', email);
	}

	updatePhotoURL(photoURL) {
		sud('photoURL', photoURL);
	}

	cacheUserDataOnDevice = () => {
		LocalStorage.setItem('userData', JSON.stringify(this.userData));
	}

	signInWithGoogle() {
		return GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
    		var {ios_key, android_key} = {} //require('../../private/google');
    		return GoogleSignin.configure({
    			iosClientId: ios_key,
  				webClientId: android_key,
    		})
			.then(() => {
				return GoogleSignin.signIn()
					.then(user => {
						console.log('GOOGLE USER:', user)
						var token = user.idToken || user.accessToken;
						var credential = firebase.auth.GoogleAuthProvider.credential(token);
						const provider = firebase.auth.GoogleAuthProvider;
						if (this.user && this.user.isAnonymous) {
	                  		this.upgradeAnonUser(provider, credential, token)
	                  	} else {
	                  		this.loginUserWithProvider(provider, token);
	                  	}
					})
			});
		})
	}

	signInWithFacebook() {
		return LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
		  (result) => {
		    if (result.isCancelled) {
		      console.log('Login cancelled');
		      return Promise.reject();
		    } else {
		      console.log('Login success with permissions: ',   result.grantedPermissions);
		      AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    const provider = firebase.auth.FacebookAuthProvider;
                    var token = data.accessToken; 
                    console.log('FACEBOOK USER:', data)
					//	var token = (config && config.user && config.user.token) || LoginStore.getFacebookToken();
                  	//  this.loginUserWithProvider(data.accessToken.toString(), provider);
                  	var credential = firebase.auth.FacebookAuthProvider.credential(token);
                  	if (this.user && this.user.isAnonymous) {
                  		this.upgradeAnonUser(provider, credential, token)
                  	} else {
                  		this.loginUserWithProvider(provider, token);
                  	}
                  }
                )
		    }
		  },
		  (error) => {
		  	if (error)
		    	alert('Login failed with error: ' + error);
		  }
		);
	}

	upgradeAnonUser(provider, credential, token) {
		firebase.auth().currentUser.linkWithCredential(credential).then((user) => {
		  	console.log("Anonymous account successfully upgraded", user);
		  	this.updateUserData(user);
		  	Dispatcher.dispatch({
				type: ActionTypes.AUTH.UPGRADE_SUCCESS,
			})
		}, (error) => {
		  console.log("Error upgrading anonymous account", error);
		  Dispatcher.dispatch({
		  	type: ActionTypes.AUTH.UPGRADE_FAIL,
		  })
		  this.loginUserWithProvider(provider, token);
		});
	}

	loginUserWithProvider(provider, providerToken){
		//if (this.isLoggedIn()) return;
		var credential = provider.credential(providerToken);
  		firebase.auth().signInWithCredential(credential)
  			.then(this._signInWithCredentialsSuccess)
  			.catch(this._signInWithCredentialsFail);
	}

	_signInWithCredentialsFail(error) {
		this.loggedIn = false; 
		console.log('Firebase Login Error', error)
		//alert('Firebase Login Error: ' + error)
		alert('Login Failed. Please reinstall the application and try again.')
	}

	_signInWithCredentialsSuccess = (data, data2) => {
		this.updateUserData(data);
		this.loadUserData();
		console.log('_signInWithCredentialsSuccess', data, data2);
  	}

	storeLastVisit() {
		var ref = gud('lastlogin');
		console.log('STORE LAST VISIT')
		ref.set(firebase.database.ServerValue.TIMESTAMP)
		.then(()=>{
			ref.once('value').then(data => {
				LocalStorage.setItem('users/' + this.user.uid + '/lastlogin', JSON.stringify(data.val()));
			})
		})
		
	}

	checkIfDeviceIsSynced() {
		var remotePromise = gud('lastlogin').once('value');
		var localPromise = LocalStorage.getItem('users/' + this.user.uid + '/lastlogin');
		remotePromise.then(remoteData => {
			if (remoteData && remoteData.val()) {
				remoteData = remoteData.val();
				localPromise.then(localData => {
					if (localData) {
						localData = JSON.parse(localData);
						if (localData == remoteData) {
							// SYNCED - PLAYED LAST TIME ON THIS DEVICE
							console.log('SYNCED'); 
						} else {
							// NOT SYNCED - PLAYED LAST TIME ON ANOTHER DEVICE
							console.log('NOT SYNCED');
						}	
					} else {
						// USER' DEVICE HAS NO TIMESTAMP - MAY BE FIRST TIME ON THIS DEVICE
					}
					this.storeLastVisit();
				});
			} else { 
				// USER HAS NO TIMESTAMP STORED IN CLOUD - MAY BE FIRST TIME IN APP
				this.storeLastVisit();
			}
		})
	}

	loadUserData() {
		localUserDataPromise.then(userData => {
			if (!userData && this.getUser()) {
				gud().once('value').then(data => {
					this.userData = data.val();
					LocalStorage.setItem('userData', JSON.stringify(this.userData));
				})
			} else {
				this.userData = JSON.parse(userData);
			}
		})
	}

	userAuthStateChange = (user) =>
	{
		console.log('FIREBASE AUTH STATE CHANGE:', (user && user.uid) );
		this.user =  user;
		if (user) {
				
		  	this.checkIfDeviceIsSynced();
			//this.loadUserData();
		} else {
		  	
		  	//this.signInAnonymously();
		}
		this.emitChange(this.user);
	}

	registerForEventsListening() {
		this.dispatchToken = Dispatcher.register(this.eventsHandler);
	}

	addChangeListener(callback) {
	    this.on(ActionTypes.CHANGE, callback);
	}

	emitChange(data) {
	    this.emit(ActionTypes.CHANGE, data);
	 }

	removeChangeListener(callback) {
		this.removeListener(ActionTypes.CHANGE, callback);
	}
}

module.exports = new  AuthService;