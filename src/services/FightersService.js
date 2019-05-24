import React from 'react'
import Icon from '../components/Icon'

var images = {
  rock : {name: 'circle', family: 'FontAwesome'}, //require('../assets/images/sets/rock.png'),
  paper : {name: 'file', family: 'Feather'}, //require('../assets/images/sets/paper.png'),
  scissors : {name: 'scissors'}, //require('../assets/images/sets/scissors.png'),
  well : {name: 'circle-o', family: 'FontAwesome'}, //require('../assets/images/sets/well.png'),
}

class FightersService {
	getImage(id, style) {
		if (!id) return;
		if (id.length == 1) id = this.getFighterClassName(id);
		var icon = images[id];
		return  <Icon name={icon.name} family={icon.family} style={style} size={30} />
	}
	getFighterClassName(id) {
	  return {
	    "A":"rock",
	    "B":"paper",
	    "C":"scissors",
	    "D":"well"
	  }[id]
	}
}

module.exports = new FightersService;
