'use strict';

import React from 'react';

import {
	View,
	Text,
	Image,
	Easing,
	ScrollView,
	StyleSheet,
	Animated,
} from 'react-native';
import Swiper from 'react-native-swiper';
import px from '../utils/PixelSizeFixer';
import Topbar from '../components/Topbar';
import Background from '../components/Background';
import Icon from '../components/Icon';
import Cell from '../components/Cell';
import Device, {width, height} from '../utils/Device';
import Button from '../components/Button';
import FightersService from '../services/FightersService'
import t from '../utils/i18n' 

class Help extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Background>
				<Topbar title={t.t('help.title')} />
				<Swiper 
					style={styles.wrapper} 
					showsButtons={true}
					activeDotColor='#ffffff'
					nextButton={
						<Text style={{
							color: '#ffffff',
							fontSize: 50,
			    			fontFamily: 'Arial'
						}}>›</Text>}
					prevButton={
						<Text style={{
							color: '#ffffff',
							fontSize: 50,
			    			fontFamily: 'Arial'
						}}>‹</Text>}
					>
  					<View style={[styles.slide]} >
  						<View style={styles.label}>
							<Text style={styles.labelText}>
								{t.t('help.schemeExplanation')}	
							</Text>
						</View>
						<FightersScheme />
  					</View>
			      	<View style={[styles.slide]}>
			      		<View style={styles.label}>
							<Text style={styles.labelText}>	
								{t.t('help.interactionExplanation1')}
							</Text>
						</View>
			      		<TutorialForTap />
			      		<View style={styles.label}>
							<Text style={styles.labelText}>	
								{t.t('help.interactionExplanation2')}
							</Text>
						</View>
			      		<TutorialForSwipe />
			      	</View>
    				<View style={[styles.slide]}>
    					<View style={styles.label}>
		  					<Text style={styles.labelText}>	
		  						{t.t('help.victoryCondition')}
		  					</Text>
		  				</View>
		  				<VictoryExamples />
		  			</View>
		  			<View style={[styles.slide]} >
		  				<View style={styles.label}>
		  					<Text style={styles.labelText}>	
								{t.t('help.tipTitle')}
							</Text>
						</View>	
					    <Button 
					        key='hintbtn'
					        vertical={true}
					        //text={'Hint'}
					        iconSize="14" 
					        style={styles.hintButton}
					        textStyle={styles.hintButtonText}
					        customIcon={FightersService.getImage("paper", {fontSize: px(20)})}
					        nounderlay
					    >
					    	<Icon family='MaterialCommunityIcons' name='crown' style={{
					    		position: 'absolute',
					    		left: 0,
					    		width: '100%',
					    		top: 0,
					    		textAlign: 'center',
					    	}} />
					    </Button>
						<View style={styles.label}>	
							<Text style={styles.labelText}>	
								{t.t('help.tip')}
							</Text>
						</View>
		  				<View style={styles.label}>
		  					<Text style={styles.labelText}>
		  						{t.t('help.goodLuck')}
		  					</Text>
						</View>
    				</View>
  				</Swiper>	
			</Background>
		);
	}
}

var styles = require('../styles').help;

class FightersScheme extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {}
		this.movementAnimation = new Animated.Value(0);
	}
	componentDidMount() {
		var settings = {
				toValue: 1,
		      	duration: 10000,
    			easing: Easing.linear,
    			useNativeDriver: true,
		    }
	    var action = Animated.timing(this.movementAnimation, settings)
	   // action.start()
	   Animated.loop(action).start()
	}
	render() {
		return (
			<Animated.Image 
				source={require("../assets/images/food_chain3.png")} 
				style={[styles.scheme,
					{
						transform: [
							{rotate: this.movementAnimation.interpolate({
								  inputRange: [0, 1],
								  outputRange: ['0deg', '360deg']
							})
						}]
					}
				]}
				resizeMode='contain'
			/>
		)
	}
}

var windowWidth = width;
var cellZone = Math.floor(windowWidth / 7);
var cellsMargin = Math.floor(cellZone / 10);
var cellRadius = cellZone - cellsMargin * 2;

class TutorialForSwipe extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {timestamp: new Date().getTime(),
			attackFirst: false,
			attackSecond: false,
			firstFighter: 'rock',
			middleFighter: 'scissors'
		}
		this.movementAnimation = new Animated.Value(0);
	}
	componentDidMount() {
		//setTimeout(()=>this.setState({timestamp: new Date().getTime()}),2000)
		this.inter = setInterval(this.runAnimation,3500)
		setTimeout(this.runAnimation)
	}

	runAnimation = () => {
		this.setState({attackFirst: true,timestamp: new Date().getTime(),})
			var settings = {
		      duration: 1000,
		      toValue:  1,  
		      velocity: 5,  
		      tension:  1 , 
		      friction:  5 ,  
		      useNativeDriver: true,
		    }
		    var action = Animated.timing(this.movementAnimation, settings)
		    //Animated.loop(action).start()
		    action.start(()=>{
		    	this.setState({
		    		attackFirst: false,
		    		firstFighter: null,
		    		middleFighter: 'rock',
		    		hideHand: true,
		     	}, ()=>{
		     		
		     			
		     			var action = Animated.timing(this.movementAnimation, settings)
		     			action.start(()=>{
		     				setTimeout(()=>
					    	this.setState({
					    		attackSecond: false,
					    		firstFighter: 'rock',
					    		middleFighter: 'scissors',
					     	})
					     	,800)
					    })
					setTimeout(()=>{
						
					    this.setState({
		     				attackSecond: true,
		     				hideHand: false,
			     		})
			     		
			     	});

		     	});

		    })
  			
	}
	componentWillUnmount() {
		clearInterval(this.inter)
	}
	render() {
		var attackFirst = {};
		var attackSecond = {};
		if (this.state.attackFirst) {
			attackFirst = {
				moveTo:1, 
				moveCorrect: true,
			}
			attackSecond = {
				moveTo:null, 
				moveCorrect: false,
			}
		}
		if (this.state.attackSecond) {
			attackFirst = {
				moveTo:null, 
				moveCorrect: false,
			}
			attackSecond = {
				moveTo:3, 
				moveCorrect: true,
			}
		}
		return (
			<View 
				//key={'container' + this.state.timestamp}
				style={{
				width: (cellZone)*3,
					height: px(100),
					//borderRadius: px(50),
					//backgroundColor: '#000000'
					//overflow: 'hidden'
					alignItems: 'center',
			}}>
				
				<View style={{flexDirection: 'row'}}>
		      	
		      		<Cell onSwipe={()=>{}} onTap={()=>{}}
		      		id={0}
		      		attackingAnimationDuration={500}
		      		attackingAnimationFinished={()=>{}}
		      		active={true} fighter={this.state.firstFighter} {...attackFirst} radius={cellRadius} margin={cellsMargin}  timestamp={this.state.timestamp}/>
		      	
		      	
		      		<Cell onSwipe={()=>{}} onTap={()=>{}}
		      		id={1}
		      		attackedAnimationDuration={900}
		      		active={true} fighter={this.state.middleFighter} radius={cellRadius} margin={cellsMargin} attacked={this.state.attackFirst || this.state.attackSecond} timestamp={this.state.timestamp} />
		      	
		      		<Cell onSwipe={()=>{}} onTap={()=>{}}
		      		id={2}
		      		attackingAnimationDuration={500}
		      		attackingAnimationFinished={()=>{}}
		      		active={true} fighter={'paper'} {...attackSecond} radius={cellRadius} margin={cellsMargin} />
		      	
		      	</View>
		      	<Animated.View style={[
		      		{
		      			marginLeft: -cellZone*1.5-cellsMargin, 
		      			marginTop: -cellZone/2,
		      			zIndex: 10,
		      			//backgroundColor: 'rgba(255,255,255,0.5)',
		      		},
		      		this.state.hideHand && {opacity: 0},
		      		this.state.attackFirst && {
		      			opacity: this.movementAnimation.interpolate({
				            inputRange: [0, 0.4, 1],
				            outputRange: [1, 1, 0.9],
				        }),
		      			transform: [
		      			{
		      				translateX: this.movementAnimation.interpolate({
				            	inputRange: [0, 0.15, 1],
				            	outputRange: [0, (cellZone + cellsMargin*2), (cellZone + cellsMargin*2)+ px(8)],
				          	})
		      			}]
		      		},
		      		this.state.attackSecond && {
		      			opacity: this.movementAnimation.interpolate({
				            inputRange: [0, 0.4, 0.9, 1],
				            outputRange: [1, 1, 1, 0],
				        }),
		      			transform: [
		      			{
		      				translateX: this.movementAnimation.interpolate({
				            	inputRange: [0, 0.15, 1],
				            	outputRange: [(cellZone*2 + cellsMargin), (cellZone + cellsMargin), (cellZone + cellsMargin)- px(18)],
				          	})
		      			}]
		      		}
		      	]}>
		      	<Icon style={{
				fontSize: px(100),

				width: px(100),
					color: '#ffffff' ,
					backgroundColor: 'transparent',
				}} name='pointer' family='EvilIcons' key='hand' />
				</Animated.View>
		      
		   </View>
		)
	}
}

class TutorialForTap extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {timestamp: new Date().getTime(),
			attackFirst: false,
			attackSecond: false,
			firstFighter: 'scissors',
			middleFighter: 'paper',
			rightFighter: 'paper'
		}
		this.movementAnimation = new Animated.Value(0);
	}
	componentDidMount() {
		//setTimeout(()=>this.setState({timestamp: new Date().getTime()}),2000)
		this.inter = setInterval(this.runAnimation,3500)
		setTimeout(this.runAnimation)
		setTimeout(()=>this.setState({showCells: true}), 500)
	}

	runAnimation = () => {
		this.setState({attackFirst: true,timestamp: new Date().getTime(),})
			var settings = {
		      duration: 900,
		      toValue:  1,  
		      velocity: 5,  
		      tension:  1 , 
		      friction:  5 ,  
		      useNativeDriver: true,
		    }
		    var action = Animated.timing(this.movementAnimation, settings)
		    //Animated.loop(action).start()
		    action.start(()=>{
		    	this.setState({
		    		attackFirst: false,
		    		firstFighter: null,
		    		middleFighter: 'scissors',
		    		//hideHand: true,
		     	}, ()=>{
		     		this.setState({
		     				attackSecond: true,
		     				//hideHand: false,
			     		})
		     			
		     			var action = Animated.timing(this.movementAnimation, settings)
		     			action.start(()=>{
		     				setTimeout(()=>
					    	this.setState({
					    		attackSecond: false,
					    		firstFighter: 'scissors',
					    		middleFighter: 'paper',
					    		rightFighter: 'paper'
					     	})
					     	,900)
					    })
					//setTimeout(()=>{
						
					    
			     		
			     	//});

		     	});

		    })
  			
	}
	componentWillUnmount() {
		clearInterval(this.inter)
	}
	render() {
		var attackFirst = {};
		var attackSecond = {};
		if (this.state.attackFirst) {
			attackFirst = {
				moveTo:1, 
				moveCorrect: true,
			}
		}
		if (this.state.attackSecond) {
			attackSecond = {
				moveTo:1, 
				moveCorrect: true,
			}
		}
		return (
			<View 
				//key={'container' + this.state.timestamp}
				style={{
				width: (cellZone)*3,
					height: px(100),
					//borderRadius: px(50),
					//backgroundColor: '#000000'
					//overflow: 'hidden'
					alignItems: 'center',
			}}>
				<View style={{flexDirection: 'row'}} >
			      	
			      		<Cell onSwipe={()=>{}} onTap={()=>{}}
			      		id={0}
			      		attackingAnimationDuration={500}
			      		attackingAnimationFinished={()=>{}}
			      		active={true} fighter={this.state.firstFighter} {...attackFirst} radius={cellRadius} margin={cellsMargin}  timestamp={this.state.timestamp}/>
			      	
			      		<Cell onSwipe={()=>{}} onTap={()=>{}}
			      		id={1}
			      		attackedAnimationDuration={900}
			      		attackingAnimationDuration={500}
			      		attackingAnimationFinished={()=>
			      			this.setState({rightFighter: 'scissors'})
			      		}
			      		active={true} fighter={this.state.middleFighter} {...attackSecond} radius={cellRadius} margin={cellsMargin} attacked={this.state.attackFirst } timestamp={this.state.timestamp} />
			      	
			      		<Cell onSwipe={()=>{}} onTap={()=>{}}
			      		id={2}
			      		attackedAnimationDuration={900}
			      		active={true} fighter={this.state.rightFighter}   radius={cellRadius} margin={cellsMargin} attacked={this.state.attackSecond }/>
			      	
		      	</View>
		      	<Animated.View style={[
		      		{
		      			marginLeft: -cellZone*1.5-cellsMargin, 
		      			marginTop: px(-16),
		      			zIndex: 10,
		      			//backgroundColor: 'rgba(255,255,255,0.5)',
		      		},
		      		this.state.hideHand && {opacity: 0},
		      		this.state.attackFirst && {
		      			opacity: this.movementAnimation.interpolate({
				            inputRange: [0, 0.4, 1],
				            outputRange: [1, 1, 0.9],
				        }),
		      			transform: [
		      			{
		      				translateX: this.movementAnimation.interpolate({
				            	inputRange: [0, 0.04,  1],
				            	outputRange: [0, 0,  cellZone],
				          	}),
		      			},
		      			{
				          	translateY: this.movementAnimation.interpolate({
				            	inputRange: [0, 0.04, 0.15 , 1],
				            	outputRange: [0, -15, -5, 0],
				          	})
		      			}]
		      		},
		      		this.state.attackSecond && {
		      			transform: [
		      			{
		      				translateX: (cellZone ),
		      			},
		      			{
				          	translateY: this.movementAnimation.interpolate({
				            	inputRange: [0, 0.04, 0.15 , 1],
				            	outputRange: [0, -15, -5, 0],
				          	})
		      			}]
		      		}
		      	]}>
		      	<Icon style={{
				fontSize: px(100),

				width: px(100),
					color: '#ffffff' ,
					backgroundColor: 'transparent',
				}} name='pointer' family='EvilIcons' key='hand' />
				</Animated.View>
		      
		   </View>
		)
	}
}

class VictoryExamples extends React.PureComponent {
	render() {
		return (
			<View style={styles.victoryExamplesWrapper} >
				
				
				<View style={styles.victoryExample}>
			      	<View style={{ zIndex: 2}}>
			      		<Cell onSwipe={()=>{}} onTap={()=>{}}
			      			id={0}

			      			active={true} fighter={'scissors'} radius={cellRadius} margin={cellsMargin} 
			      		/>
			      	</View>
			      	<View style={{  zIndex: 1}}>
			      		<Cell onSwipe={()=>{}} onTap={()=>{}}
			      			id={1}
			      			active={true} fighter={null} radius={cellRadius} margin={cellsMargin} 
			      		/>
			      	</View>
			      	<View style={{  zIndex: 1}}>
			      		<Cell onSwipe={()=>{}} onTap={()=>{}}
			      			id={2}
			      			active={true} fighter={'rock'} radius={cellRadius} margin={cellsMargin} 
			      		/>
			      	</View>
			      	<Text style={styles.X}>{'\u2718'}</Text>
		      	</View>

		      	<View style={styles.victoryExample}>
			      	<View style={{ zIndex: 2}}>
			      		<Cell onSwipe={()=>{}} onTap={()=>{}}
			      			id={0}
			      			active={true} fighter={null} radius={cellRadius} margin={cellsMargin} 
			      		/>
			      	</View>
			      	<View style={{  zIndex: 1}}>
			      		<Cell onSwipe={()=>{}} onTap={()=>{}}
			      			id={1}
			      			active={true} fighter={'paper'} radius={cellRadius} margin={cellsMargin} 
			      		/>
			      	</View>
			      	<View style={{  zIndex: 1}}>
			      		<Cell onSwipe={()=>{}} onTap={()=>{}}
			      			id={2}
			      			active={true} fighter={null} radius={cellRadius} margin={cellsMargin} 
			      		/>
			      	</View>
			      	<Text style={styles.V}>{'\u2713'}</Text>
		      	</View>

		      	<View style={styles.victoryExample}>
			      	<View style={{ zIndex: 2}}>
			      		<Cell onSwipe={()=>{}} onTap={()=>{}}
			      			id={0}
			      			active={true} fighter={'scissors'} radius={cellRadius} margin={cellsMargin} 
			      		/>
			      	</View>
			      	<View style={{  zIndex: 1}}>
			      		<Cell onSwipe={()=>{}} onTap={()=>{}}
			      			id={1}
			      			active={true} fighter={null} radius={cellRadius} margin={cellsMargin} 
			      		/>
			      	</View>
			      	<View style={{  zIndex: 1}}>
			      		<Cell onSwipe={()=>{}} onTap={()=>{}}
			      			id={2}
			      			active={true} fighter={'scissors'} radius={cellRadius} margin={cellsMargin} 
			      		/>
			      	</View>
			      	<Text style={styles.V}>{'\u2713'}</Text>
		      	</View>
		      	
		    </View>
		)
	}
}

module.exports = Help;
