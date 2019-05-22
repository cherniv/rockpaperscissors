'use strict';

var levels;

import LEVELS from '../levels';
import LocalStorage from '../utils/LocalStorage'

class LevelsService {

	 constructor() {
		
		this.loadLevels();
	}

	async loadLevels(){
	  await LocalStorage.removeItem("fighters");
	  levels = LEVELS;
	  //console.log(levels);
	  /*levels ={};
	  
	  for(var i in LEVELS) {
	    levels[i] = LEVELS[i].map(function(level){
	      return {
	        width: level.w,
	        cells: level.cs,
	        fighter: level.fighter
	      }
	    })
	  }
	  */

	//console.log(levels)
	  
	  for(var i in levels) {
	    if(levels[i][0]) levels[i][0].isOpen = true;
	  }

	  this.fitFighters();
	  //this.markPassedAndHintedLevels();
	}

	async fitFighters(){
	  var preFighters;

	  try {
		  preFighters = await LocalStorage.getItem("fighters");
		  if (preFighters){
		    preFighters = JSON.parse(preFighters);
		  } else {
		  	preFighters = {}
		  }
		} catch (error) {
		  console.error('Error retrieving data' , error);
		}

	  var fs = {};
	      fs['easy'] = ["A","B","C"];
	      fs['medium'] = ["A","B","C"];
	      fs['hard'] = ["A","D","B","C"];
	      fs['extreme'] = ["A","D","B", "C"];

	  var getFighterByOffset = function(diff, fighter, offset) {

	    var fi = fs[diff].indexOf(fighter);
	    var fo = fi + offset;
	    if (fo >= fs[diff].length) {
	      fo = fo - fs[diff].length;
	    }
	   // console.log(diff, fighter, offset, fs[diff][fo]);
	    return fs[diff][fo];
	  }


	  if (!preFighters.easy) {
	    for(var i in levels) {
	      preFighters[i] = [];
	      for(var j = 0; j<levels[i].length; j++){
	        var o = Math.random()*fs[i].length | 0;
	        preFighters[i].push(o);
	      }
	    }
	  
	    LocalStorage.setItem("fighters", JSON.stringify(preFighters));
	   
	  }


	for(var i in levels) {
	  for(var j = 0; j<levels[i].length; j++){
	    var f = levels[i][j].fighter;
	    var o = preFighters[i][j];
	    var nf = getFighterByOffset(i, f, o);
	    levels[i][j].fighter = nf;
	    for(var b=0; b<levels[i][j].cells.length; b++){
	      //console.log(">>",levels[i][j]);
	      if(levels[i][j].cells[b].active)
	      levels[i][j].cells[b].fighter = getFighterByOffset(i, levels[i][j].cells[b].fighter, o);
	    }
	  }
	}
	        

	  //console.log(preFighters, levels);
	}

	async markPassedAndHintedLevels(){
	  //console.log("markPassedAndHintedLevels")
	  var passed;
	  try {
		  passed = await LocalStorage.getItem("passed");
		  if (passed !== null){
		    // We have data!!
		    passed = JSON.parse(passed);
		  }
		} catch (error) {
		  console.error('Error retrieving data' , error);
		}

	  for(var i in passed) {
	    //console.log("diff",i,passed[i].length)
	    for(var j = 0; j<passed[i].length; j++){
	      if(levels[i][j] && passed[i][j] && (passed[i][j][0]!=0 || +passed[i][j][2]==1)) {
	        levels[i][j].isOpen = (levels[i][j+1] || {}).isOpen = true;
	        levels[i][j].score = passed[i][j][0];
	        levels[i][j].time = passed[i][j][1];
	        levels[i][j].hinted = passed[i][j][2] == 1;
	        //console.log("after load:",levels[i][j])
	      }
	    }
	    
	  }
	}

	getLevels(diff) {


	  //if(!levels) this.loadLevels();
	  //console.log(diff, levels)
	  return (diff) ? levels[diff] : levels;
	}

	checkLevel(cells) {
	  var fighter;
	  var flag = true;
	  for(var i = 0; i<cells.length; i++) {
	    if(cells[i].fighter) {
	      if(!fighter) fighter = cells[i].fighter;
	      else if(fighter != cells[i].fighter) {
	        flag = false;
	      }
	    }
	  }
	  return {flag, fighter};
	}

	levelHinted(id, diff) {
	  levels[diff][id].hinted = true;
	  console.log(diff,id,levels[diff][id])
	  this._saveToLocalStorage();
	} 

	levelPassed(id, diff, score, time) {
	  levels[diff][id].score =  score ;
	  levels[diff][id].time =  time ;

	  (levels[diff][id+1] || {}).isOpen = true;
	  
	  this._saveToLocalStorage();
	}

	_saveToLocalStorage() {
	  var arrToSave = {};
	  for(var i in levels) {
	    arrToSave[i] = levels[i].map(function(item){
	      var a = [];
	      a.push(item.score || 0);
	      a.push(item.time || 0);
	      if (item.hinted) 
	        a.push(1);
	      //console.log("before save:",i,item,a)
	      return a;
	    });
	  }
	  LocalStorage.setItem("passed", JSON.stringify(arrToSave));

	}

	getLastOpenedLevel(diff) {
	  if(!levels) return null;
	  var allOpened = levels[diff].filter(function(item){return item.isOpen});
	  return allOpened[allOpened.length-1];
	}

	getLastPassedLevel(diff) {
	  if(!levels) return null;
	  var allPassed = levels[diff].filter(function(item){return item.score && item.score>0});
	  return allPassed[allPassed.length-1];
	}

	getTotalScore(diff) {
	  var score = 0;
	  levels[diff].forEach(function(item){score += item.score ? item.score : 0});
	  return score;
	}

}

export default new LevelsService;