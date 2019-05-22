import React, { Component } from 'react';
import { 
	View, 
	Text, 
	Image,
	StyleSheet,
	Dimensions,
	Animated,
} from 'react-native';
import Levels from '../services/LevelsService'
import LevelsManager from '../models/LevelsManager'
import Cell from '../components/Cell'
import CellsContact from '../services/CellsContactService'
var Dispatcher = require('dispatcher/AppDispatcher');
var ActionTypes =  require('actions/ActionTypes');
import Topbar from 'components/LevelTopbar';
import Background from 'components/Background'
import Icon from 'components/Icon'
import {level as styles} from 'styles';
import FightersService from 'services/FightersService'

var windowWidth = Dimensions.get('window').width;
var cellZone = Math.floor(windowWidth / 7);
var cellsMargin = Math.floor(cellZone / 14);
var cellRadius = cellZone - cellsMargin * 2;



var createCorrectMovesArrays = function(diff, cells, width){
  for (var i = 0; i< cells.length; i++){
    var cell = cells[i];
    
    var possibleMovesCount = 0;
    var arr = [];
    if(cell.fighter){
      for ( var dir = 0; dir<4; dir++) {
        var checkCell = CellsContact.check(diff, cells, width, cell, dir);
        arr.push(checkCell);
        if(checkCell) possibleMovesCount++;
      }
    }
    cell.correctMoves = arr;
    cell.possibleMovesCount = possibleMovesCount;
  }
}

var cleanCellMovementProperties = function(cell) {
	cell.moveTo = cell.moveCorrect = cell.attacked = cell.nowhereToMove = null;
}

class Level extends Component {
	constructor(props) {
		super(props);
		this.state = {loading: true};
		this.attackingAnimationFinished = this.attackingAnimationFinished.bind(this);
		this.renderCell = this.renderCell.bind(this);
		this.restartLevel = this.restartLevel.bind(this);
		this.undoStep = this.undoStep.bind(this);
		this.showHint = this.showHint.bind(this);
		this.id = this.props.navigation.state.params.id;
		this.diff = this.props.navigation.state.params.diff;
		LevelsManager.getLevel(this.diff, this.id); // for faster preloading
		this.registerForEventsListening();
	}

	componentWillMount() {
		this.initLevel();
	}

	componentDidMount() {
		this.stopTimer();
		this.startTimer();
		//this.startTutorial();
	}

	startTutorial() {
		Animated.timing(
		  // Animate value over time
		  this.state.moveHandAnim, // The value to drive
		  {
		    toValue: 1, // Animate to final value of 1
		  }
		).start();
	}

	startTimer() {
		this.startTime = new Date();
		this.interval = setInterval(()=>{
			this.setState({
			 	currentTime: new Date() - this.startTime,
			})
		}, 500);
	}

	stopTimer() {
		clearInterval(this.interval);
	}

	initLevel(restart = false) {
		this.steps = [];
		LevelsManager.getLevel(this.diff, this.id).then(level => {
			//console.log('GOT LEVEL', level)
			level = JSON.parse(JSON.stringify(level));
			this.width = level.width;
			this.fighter = level.fighter;
			var state = {loading: false, cells: level.cells, shouldShowHint: (this.diff == "easy" || level.hinted), blinkRestartButton: false};
			this.setState(state);
			createCorrectMovesArrays(this.diff, level.cells, this.width)
			level.cells.forEach(cleanCellMovementProperties);
		})
	}

	cellOnTap = (cellId) => {
		var cells = this.state.cells;
		var cell = cells[cellId];
		var {correctMoves} = cell;

		var possibleMovesLength = correctMoves.filter(item => !!item).length;

		if (!possibleMovesLength) { 
			cell.nowhereToMove = true;
			cell.moveCorrect  = false;
			this.setState ({cells: this.state.cells});
		} else if (possibleMovesLength == 1) {

			var checkCellIndex = correctMoves.findIndex(item => !!item);
			var checkCell = correctMoves[checkCellIndex];
			var dir = checkCellIndex;

			for (var i = 0, len = cells.length; i < len; i ++ ) {
				cleanCellMovementProperties(cells[i])
			}

			if (checkCell){
				checkCell.attacked = true;
				// Storing current move in stack of steps
				// has to remove correctMoves to prevent JSON Circular bug
				this.steps.push(JSON.parse(JSON.stringify(this.state.cells.map(item => {return { ...item, correctMoves: null}}))));
			}

			cell.moveCorrect = !!checkCell;
			cell.moveTo = dir;

			this.setState ({cells: this.state.cells, blockSwipe: true});
		} else if (possibleMovesLength > 1) {
			var checkCellIndexes = correctMoves.reduce(function(a, e, i) {
			    if (e)
			        a.push(i);
			    return a;
			}, []);

			var dir = checkCellIndexes[Math.floor(Math.random()*checkCellIndexes.length)];;
			cell.moveTo = dir;
			this.setState ({cells: this.state.cells});
		}

	}

	cellOnSwipe = (cellId, dir) => {
		var cells = this.state.cells;
		var cell = cells[cellId];
		var checkCell = cell.correctMoves[dir];

		// Stop all animations
		for (var i = 0, len = cells.length; i < len; i ++ ) {
			cleanCellMovementProperties(cells[i])
		}

		if (checkCell){
			checkCell.attacked = true;
			// Storing current move in stack of steps
			// has to remove correctMoves to prevent JSON Circular bug
			this.steps.push(JSON.parse(JSON.stringify(this.state.cells.map(item => {return { ...item, correctMoves: null}}))));
		}

		cell.moveCorrect = !!checkCell;
		cell.moveTo = dir;

		this.setState ({cells: this.state.cells, blockSwipe: !!checkCell});
	}

	incorrectAnimationFinished = (cellId) => {
		var cells = this.state.cells;
		var cell = cells[cellId];
		cell.moveTo = null;
		this.setState ({cells: this.state.cells, blockSwipe: false});
	}

	nowheretomoveAnimationFinished = (cellId) => {
		var cells = this.state.cells;
		var cell = cells[cellId];
		cell.nowhereToMove = null;
		this.setState ({cells: this.state.cells, blockSwipe: false});
	}

	attackingAnimationFinished(cellId, dir) {
		var cells = this.state.cells;
		var cell = cells[cellId];
		var checkCell = cell.correctMoves[dir];

		checkCell.fighter = cell.fighter;
		cell.fighter = null;
		cleanCellMovementProperties(cell);
		cleanCellMovementProperties(checkCell)

		this.setState ({cells: this.state.cells, blockSwipe: false});

		this.checkLevelEnd();
		this.checkLevelFail();
	}

	componentWillUnmount() {
		this.stopTimer();
		if (this.dispatchToken) Dispatcher.unregister(this.dispatchToken);
	}

	checkLevelEnd() {
		var checkLevelResult = Levels.checkLevel(this.state.cells);
		var isLevelFinished = checkLevelResult.flag;
     	if (isLevelFinished) {
     		this.stopTimer();
     		Dispatcher.dispatch({
     			type: ActionTypes.GAME.LEVEL_SUCCESS,
     			data: {id: this.id, diff: this.diff, whowon: checkLevelResult.fighter, time: new Date() - this.startTime}
     		});
     	} else {
     		createCorrectMovesArrays(this.diff, this.state.cells, this.width);
     	}
	}

	checkLevelFail() {
		var {cells} = this.state;
		var cellsAbleToMove = cells.reduce((arr, item)=>{
			if(item.correctMoves.filter(i => !!i).length)
				arr.push(item);
			return arr;
		}, []);
		if (!cellsAbleToMove.length) {
			this.setState({blinkRestartButton: true})
		}
	}

	undoStep() {
		if (!this.steps.length) return;

	    var prevStepCells = this.steps.pop();
	    this.setState({cells: prevStepCells, blinkRestartButton: false});
	    createCorrectMovesArrays(this.diff, prevStepCells, this.width)
		prevStepCells.forEach(cleanCellMovementProperties);
  }

	renderCell(cell, index) {
		return (
			<Cell 
				id={index}
				key={index}
				active={cell.active}
				radius={cellRadius} 
				margin={cellsMargin}
				moveTo={cell.moveTo}
				moveCorrect={cell.moveCorrect}
				nowhereToMove={cell.nowhereToMove}
				fighter={FightersService.getFighterClassName(cell.fighter)}
				onSwipe={this.state.blockSwipe ? (()=>{}) : this.cellOnSwipe}
				onTap={this.cellOnTap}
				attacked={cell.attacked}
				attackingAnimationFinished={this.attackingAnimationFinished}
				incorrectAnimationFinished={this.incorrectAnimationFinished}
				nowheretomoveAnimationFinished={this.nowheretomoveAnimationFinished}
				timestamp={this.startTime}
			/>
		)
	}
 
	renderTutorialAnimation() {
		return null;
		return (
			<Animated.View style={{
				position: 'absolute',
				top: '50%',
			}}>
				<Icon style={styles.tutorialHand} name='pointer' family='EvilIcons' />
			</Animated.View>
		)
	}

	render() {
		if (this.state.loading) return null;
		var cells = this.state.cells;
		var cellsInRow = this.width;
		var cellsElements = cells.map(this.renderCell);
    return (
    	<Background>
	      <View style={styles.container}>
	      	<Topbar 
	      		currentTime={this.state.currentTime}
	      		diff={this.diff} 
	      		level={this.id}
						onPressRestart={this.restartLevel}
						onPressUndo={this.undoStep}
						onPressHint={this.state.shouldShowHint ? null : this.showHint}
						hint={FightersService.getFighterClassName(this.fighter)}
						blinkRestartButton={this.state.blinkRestartButton}
	      	/>
	      	<View style={[styles.cellsContainerWrapper]} >
		      	<View style={[
		      		styles.cellsContainer, 
		      		{width: cellsInRow * cellZone + cellZone/8 
		      		/* this magic cellZone/8 need for incorrect move animation layout fix */}
		      		]} 
		      	>
					{cellsElements}
		      	</View>
		    </View>
		    {this.renderTutorialAnimation()}
	      </View>
	    </Background>
    )
	}

  restartLevel(){
  	this.stopTimer();
    this.initLevel(true);
    this.startTimer();
  }

  showHint() {
  	this.setState({shouldShowHint: true})
  }


  // HACK FOR CLEANING OLD ROUTES FROM REACT NAVIGATION STACK
  eventsHandler = (action) => {
    var data = action.data;
	  switch(action.type) {
	  	case ActionTypes.ROUTER.ROUTE_CHANGED: 
	  		if (!data) return;
	  		var {currentRoute} = data;
	  		if (!currentRoute) return;
	  		var {routeName, params} = currentRoute;
	  		if (!routeName || !params ) return;
	  		if (routeName == 'LEVEL' && (params.diff != this.diff || params.id != this.id)) {
	  			this.setState({loading: true});
	  			Dispatcher.unregister(this.dispatchToken);
	  			delete this.dispatchToken;
	  			this.stopTimer();
	  			//console.log('SHUTTING DOWN LEVEL', this.diff, this.id)
	  		}
	  	break;
	  }
	}

  registerForEventsListening() {
	this.dispatchToken = Dispatcher.register(this.eventsHandler);
	}

}

module.exports = Level;