import LocalStorage from '../utils/LocalStorage';
import * as firebase from 'firebase';
import Auth from '../services/Auth'
import ActionTypes from '../actions'
import NetInfo from '../utils/NetInfo'
import FirebaseService from '../services/FirebaseService'
import t from '../utils/i18n' 

var sud = FirebaseService.saveUserData;
var gud = FirebaseService.getUserData;

//LocalStorage.removeItem('difficulties')
import Dispatcher from '../dispatcher';

var cachedDiffs = {}
var cachedPromises = {};
var diffsData;

var generatePath = (diff) => {
	return 'levels/' + diff;
}

var generateUserDataPath = (diff, index) => {
	return 'user-progress/' + Auth.getId() + '/' + diff;
}

var getFromLocalStorage = (diff) => {
	return LocalStorage.getItem(generatePath(diff)).then(data => gotFromLocalStorage(diff, data))
}

var gotFromLocalStorage = (diff, data) => {
	if (data) {
		data = JSON.parse(data);
		//console.log('DIFF IS CACHED IN STORAGE:', data)
		gotAsyncData(diff, data)
		return data;
	} else {
		//console.log('DIFF IS NOT CACHED IN STORAGE:', diff)
		return Promise.reject();
	}
}

var gotAsyncData = (diff, data) => {
	cachedDiffs[diff] = data;
	var path = generatePath(diff);
	delete cachedPromises[path];
}

var getFromRemote = (diff) => {
	var path = generatePath(diff);
	return (
		firebase.database()
			.ref(path).once('value')
			.then(levels => {
				levels = levels.val();
				return (
					 getUserProgressFromRemote(diff)
					 	.then(userData => {
					 		//console.log('THERE ARE SOME PROGRESS', userData.val())
					 		userData = userData.val();
					 		if (userData) {
					 			levels = levels.map((level, i) => ({...level, ...userData[i]}) )
					 		}
							return gotFromRemote(diff, levels);
					 	})
					 	.catch(e => {console.log('CATCH', e); return gotFromRemote(diff, levels )})
				)
			})
	)
}

var gotFromRemote = (diff, data) => {
	var path = generatePath(diff);
	//data = data.val();
	//console.log('DIFF IS LOADED FROM REMOTE', data)
	storeInLocal(path, data);
	gotAsyncData(diff, data);
	return data;
}

var getUserProgressFromRemote = (diff) => {
	var userPath = generateUserDataPath(diff);
	///console.log('ROGRESS PATH:', userPath)
	return (
		firebase.database()
			.ref(userPath).once('value').then(data=> { 
				//console.log('USER PROGRESS >>>>', data.val()); 
				return data})
			.catch(e => console.log('<<<<<<', e))
	)
}

var storeInLocal = (path, data) => {
	LocalStorage.setItem(path, typeof data == 'object' ? JSON.stringify(data) : data);
}

var updateUserProgress = (diff, index, obj) => {
	cachedDiffs[diff][index] = {...cachedDiffs[diff][index], ...obj};
	storeInLocal(generatePath(diff), cachedDiffs[diff]);
	Object.keys(obj).forEach(prop => {
		storeInRemote(generateUserDataPath(diff) + '/' + index + '/' + prop , obj[prop] )
	})
}

var storeInRemote = (path, value) => {
	return firebase.database()
		.ref(path).set(value)
}

var loadDiffsMenuData = () => {

	var preloadDiffs = () => {
		if (Auth.getUser()) Object.keys(diffsData).forEach(getDiff);
	}

	LocalStorage.getItem('difficulties').then(data => {
		if (data) {
			data = JSON.parse(data);
			diffsData = data;
			preloadDiffs();
		} else {
			firebase.database().ref('difficulties').orderByChild('order').once('value').then(data=>{
		   		diffsData = data.val();
		   		LocalStorage.setItem('difficulties', JSON.stringify(diffsData));
		   		//console.log('DIFFS DATA FROM REMOTE', diffsData);
		   		preloadDiffs();
		    })
		}
	})
	
}

var getDiff = (diff) => {
		//console.log("GET DIFF", diff)
		var promise;
		var cachedDiff = cachedDiffs[diff];
		if (cachedDiff) { // check in memory cache
			//console.log('DFF IS CACHED IN MEMORY', cachedDiff)
			promise = Promise.resolve(cachedDiff);
		} else {
			var path = generatePath(diff);
			if (cachedPromises[path]) {
				//console.log('DIFF IS CURRENTLY ASYNCING', cachedPromises[path])
				promise = cachedPromises[path];
			} else {
				promise = (
					getFromLocalStorage(diff)
						.catch(() => getFromRemote(diff))
				);
				cachedPromises[path] = promise;
			}
		}

		return promise;
	} 

var isDiffPassed = (diff) => {
	var levels = cachedDiffs[diff];
	var passedLevels = levels.filter(level => level.passed);
	return passedLevels.length == levels.length;
}

var killCache = () => {
	cachedDiffs = {}
	cachedPromises = {};
	diffsData = null;
	LocalStorage.getAllKeys((err, keys) => {
		console.log('LocalStorage.getAllKeys', err, keys)
		keys.forEach(key => {
			if (key.indexOf('levels/') == 0 || key == "difficulties") {
				LocalStorage.removeItem(key);
			}
		})
	})
}

var getCompletedLevelsCount = () => {
	var totalCompleted = 0;
	var keys = diffsData && Object.keys(diffsData);
	if (!keys) return 0;
		var diffs = [];
		keys.forEach(key => {
			var levels = cachedDiffs[key];
			if (levels && levels.length) {
				var passedLevels = levels.filter(level => level.passed).length;
				totalCompleted += passedLevels;
			}
		})
	return totalCompleted;
}

var updateCompleteLevelsCount = () => {
	setTimeout(()=>{
    var totalCompleted = getCompletedLevelsCount();
    
		sud('completedLevelsCount', totalCompleted)
	},50)
}

class LevelsManager{
	constructor(props) {
		//LocalStorage.removeItem('difficulties');
		loadDiffsMenuData();
		this.dispatchToken = Dispatcher.register(this.eventsHandler);
	}

	eventsHandler = (e) => {
		var {type, data} = e;
		switch(type) {
			case ActionTypes.GAME.LEVEL_SUCCESS:
				this.levelPassed(data);
				this.updateDifficultyAverageIfPassed(data);
			break;
			case ActionTypes.APP.FIREBASE_AUTH_STATE_CHANGE:
				loadDiffsMenuData();
			break;
			case ActionTypes.AUTH.UPGRADE_FAIL:
				killCache();
			break;
			default: 

		}
	}

	getCompletedLevelsCount() {return getCompletedLevelsCount()}

	updateDifficultyAverageIfPassed(data) {
		var {diff} = data;
		var diffPassed = isDiffPassed(diff);
		if (diffPassed) {
			var average  = this.getDiffAverageTime(diff);
			var ref = firebase.database().ref('highscore-difficulties').child(diff).child(Auth.getId());
			ref.once('value').then(data => {
				if (!data.exists() || data.val() > average)  {
					ref.set(average);
				}
			})
		}
	}

	getDiffTitle(diff) {
		return t.tt(diffsData[diff].titles);
	}

	getDiff(diff) {
		return getDiff(diff);
	}

	getLevel(diff, index) {
		//console.log('GET LEVEL', diff, index);
		return this.getDiff(diff).then(levels => levels[index]);
	}

	levelPassed(data) {
		var obj = {passed: true};
		var prevTime = cachedDiffs[data.diff][data.id].time;
		if (!prevTime || prevTime > data.time) {
			obj = {...obj, whowon: data.whowon, time: data.time}
		}
		updateUserProgress(data.diff, data.id, obj);
		updateCompleteLevelsCount();
	}

	getLevelTotalIndex(diff, index) {
		return diffsData[diff].order * cachedDiffs[diff].length + index + 1;
	}

	getDiffsLabelsAndPercents() {
		//console.log('getDiffsLabelsAndPercents', diffsData)
		//console.log('getDiffsLabelsAndPercents', cachedDiffs)
		var keys = Object.keys(diffsData);
		var diffs = [];
		keys.forEach(key => {
			//console.log('key', key, cachedDiffs[key]);
			var levels = cachedDiffs[key];
			var levelsProgress
			if (levels && levels.length) {
				var passedLevels = levels.filter(level => level.passed).length;
				levelsProgress = passedLevels * 100 / levels.length ;
			} else {
				levelsProgress = 0;
			}
			
			diffs.push({...diffsData[key], key,  levelsProgress})
		})

		return diffs;
	} 

	getDiffAverageTime(diff) {
		var levels = cachedDiffs[diff];
		if (!levels) return 0; // crash prevent when levels still not loaded
		var totalTime = 0;
		var passedLevels = levels.filter(level => level.passed);
		passedLevels.forEach(level => totalTime += level.time);
		return Math.floor(totalTime / passedLevels.length);
	}

	getNextDiff(diff) {
		var order = diffsData[diff].order;
		var diffs = Object.keys(diffsData).map(key => ({...diffsData[key], key}));
		diffs.sort((d1, d2) => d1.order - d2.order);
		var nextDiff = (order + 1 == diffs.length )  ? null : diffs[order + 1].key;
		console.log('nextDiff', nextDiff);
		return nextDiff
	}

	getLastOpenedIndex(diff) {
		var d = cachedDiffs[diff];
		var lastOpenedIndex = d.filter(level=>level.passed).length;
		return lastOpenedIndex;
	}
}

export default new LevelsManager;
