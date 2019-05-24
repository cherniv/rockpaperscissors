import LocalStorage from '../utils/LocalStorage';
import Device from '../utils/Device';

//var Sound = require('react-native-sound');

var musicAllowed;
LocalStorage.getItem('musicAllowed').then(data => {
	if (data) musicAllowed = !data || data == 'true';
	else musicAllowed = true;
	if (musicAllowed) playMusic();
})

var whoosh;

class Sound {}

var playMusic = () => {
	whoosh = new Sound(Device.isIos ? 'bensound-thelounge.mp3' : 'bensound_thelounge.mp3', 
		Sound.MAIN_BUNDLE, (error) => {
	  if (error) {
	    console.log('failed to load the sound', error);
	    return;
	  }
	  // loaded successfully
	  //console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

	  whoosh.setNumberOfLoops(-1);

	  whoosh.play((success) => {
	  if (success) {
	    //console.log('successfully finished playing');
	  } else {
	    //console.log('playback failed due to audio decoding errors');
	    // reset the player to its uninitialized state (android only)
	    // this is the only option to recover after an error occured and use the player again
	    //whoosh.reset();
	  }
	});

});
}

var stopMusic = () => {
	whoosh && whoosh.stop(() => {
	  // Note: If you want to play a sound after stopping and rewinding it,
	  // it is important to call play() in a callback.
	  //whoosh.play();
	});
}

var brightness;
LocalStorage.getItem('brightness').then(data => {
	if (data) brightness = +data;
	else brightness = 0.9
});

var animationsAllowed;
LocalStorage.getItem('animationsAllowed').then(data => {
	if (data) animationsAllowed = !data || data == 'true';
	else animationsAllowed = true;
	
})

class Settings {
	getMusicAllowed () {
		return musicAllowed;
	}

	setMusicAllowed(val) {
		if (val) playMusic();
		else stopMusic();
		musicAllowed = val
		LocalStorage.setItem('musicAllowed', val.toString());
	}

	getBrightness() {
		return brightness;
	}

	setBrightness(val) {
		brightness = val;
		LocalStorage.setItem('brightness', val.toString())
	}

	getAnimationsAllowed() {
		return animationsAllowed;
	}

	setAnimationsAllowed(val) {
		animationsAllowed = val;
		LocalStorage.setItem('animationsAllowed', val.toString())
	}
}

export default new Settings;