const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


var updateHighscoreTable = function(event) {
	var {diff, userId, level} = event.params;
	var time = event.data.val();
	var ref = event.data.ref.parent.parent.parent.parent.parent.child('/highscore-levels/' + diff + '/' + level + '/' + userId);
	return ref.set(time)
}

var ref = functions.database.ref('/user-progress/{userId}/{diff}/{level}/time');

exports.updateUserTimeInHighscoreTable = ref.onUpdate(updateHighscoreTable);

exports.addUserTimeInHighscoreTable = ref.onCreate(updateHighscoreTable);

/*
exports.cleanAfterUserDelete = functions.auth.user().onDelete(event => {
 	const {uid} = user;

	// HAVE TO CLEAN ALL USER PROGRESS
	// OTHERWISE IT WILL TRY TO SHOW UP
	// IN HIGHSCORE TABLES AND WILL 
	// CRASH THE APP

  return functions.database.ref('users/' + uid).set(null);
});
*/