//import RNFetchBlob from 'react-native-fetch-blob'
//const Blob = RNFetchBlob.polyfill.Blob;
import * as firebase from 'firebase';

var originalXMLHttpRequest = window.XMLHttpRequest;
var originalBlob = window.Blob;
		

const revertStuffBack = () => {
	window.XMLHttpRequest = originalXMLHttpRequest;
	window.Blob = originalBlob;
}

const treatUpload = (uploadTask) => {
	 uploadTask.on('state_changed', function(snapshot){
  // Observe state change events such as progress, pause, and resume
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  console.log('Upload is ' + progress + '% done');
  switch (snapshot.state) {
    case firebase.storage.TaskState.PAUSED: // or 'paused'
      console.log('Upload is paused');
      break;
    case firebase.storage.TaskState.RUNNING: // or 'running'
      console.log('Upload is running');
      break;
  }
}, function(error) {
  // Handle unsuccessful uploads
}, function() {
  // Handle successful uploads on complete
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  var downloadURL = uploadTask.snapshot.downloadURL;
});
}

const upload = (data, userId, filename) => {
	var originalXMLHttpRequest = window.XMLHttpRequest;
		var originalBlob = window.Blob;
		window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
		window.Blob = Blob
	return Blob.build(data.data, { type: 'application/octet-stream;BASE64' })
		  .then((blob) => {

		  	var uploadTask = firebase.storage()
		        .ref('users/' + userId)
		        .child(filename)
		        .put(blob, { contentType : 'image/png' });

		    uploadTask.then(revertStuffBack)
		        .catch(revertStuffBack)

		    //treatUpload(uploadTask)

		    return uploadTask;



		    })

		 
}

class UserpicUploader {

	uploadCustomUserpic(data, userId) {
		return upload(data, userId,  'custom.png');
	} 

}

module.exports = new UserpicUploader;