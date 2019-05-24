'use strict';

import React, {Component} from 'react';
import {
	View,
	Image,
	StyleSheet,
	PanResponder,
	Animated,
	Easing,
} from 'react-native';

import px from '../utils/PixelSizeFixer'
import FightersService from '../services/FightersService'

const fadeOutDuration = 200;
const attackDuration = 200;

export default class Cell extends Component {
	constructor(props) {
		super(props);
		this.state = ({attacked: props.attacked, moveCorrect: props.moveCorrect, fighter: props.fighter, moveTo: props.moveTo})
		this.movementAnimation = new Animated.Value(0);
		this._handlePanResponderEnd = this._handlePanResponderEnd.bind(this);
		this.correctMovementAnimationEnded = this.correctMovementAnimationEnded.bind(this);
		this.incorrectMovementAnimationEnded = this.incorrectMovementAnimationEnded.bind(this);
		this._handleStartShouldSetPanResponder = this._handleStartShouldSetPanResponder.bind(this);
	}
	componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
      // onPanResponderMove: (a,b) => {
      //   var {x0 , y0, moveX, moveY} = b;
      //   this.setState({x0 , y0, moveX, moveY});
      //   console.log(x0 , y0, moveX, moveY)
      // }
    });
  }

  runFadeOutAnimation() {
    this.fadeOutAnim = new Animated.Value(1);
    Animated.timing(                            
      this.fadeOutAnim,                      
      {
        duration: fadeOutDuration,
        toValue: 0.0,
      }
    ).start(); 
  }

  componentWillReceiveProps(props) {
    //this.movementAnimation && this.movementAnimation.stopAnimation();
    this.fadeOutAnim && this.fadeOutAnim.stopAnimation();

    if (this.state.fighter != props.fighter) {
      if (!this.state.fighter) this.movementAnimation = new Animated.Value(0);
      this.setState({fighter: props.fighter});
    }

    if (this.state.attacked != props.attacked) {
      if (props.attacked) {
        this.runFadeOutAnimation()
      }
      this.setState({attacked: props.attacked})
    }

    if (this.state.moveTo != props.moveTo) {
      if (props.moveTo != null) {
        var isCorrect = props.moveCorrect;
        this.animate(props.moveTo, isCorrect, isCorrect ? this.correctMovementAnimationEnded : this.incorrectMovementAnimationEnded );
      }
      this.setState({moveTo: props.moveTo, moveCorrect: isCorrect})
    }
  }

  _handleStartShouldSetPanResponder() {
  	this.movementAnimation.stopAnimation();
    return true;
  }

  _handlePanResponderEnd(e, e2) {

  	var {dx, dy, vx, vy} = e2;
  	var dir ;
  	if ((dx <= 0 && dy <= 0 && dx >= dy) || (dx >= 0 && dy <=0 && Math.abs(dy) >= dx)) {
  		dir = 0;
   	} else
  	if ((dx >= 0 && dy <= 0 && dx >= Math.abs(dy)) || (dx >= 0 && dy >= 0 && dy <= dx)) {
  		dir = 1;
  	} else
  	if ((dx >= 0 && dy >= 0 && dx <= dy) || (dx <= 0 && dy >= 0 && dy >= Math.abs(dx))){
  		dir = 2;
  	} else {
  		dir = 3;
  	}

    this.props.onSwipe(this.props.id, dir);
  }

  incorrectMovementAnimationEnded() {
  	
  }

  correctMovementAnimationEnded() {
    this.props.attackingAnimationFinished(this.props.id, this.state.moveTo);
  }

  animate(dir, isCorrect, completeCallback) {
  	var settings = {
  		duration: attackDuration,
      toValue: isCorrect ? 1 : 0,   // Returns to the start
      velocity: 5,  //Math.max(Math.abs(vx), Math.abs(vy)) / this.props.radius * 5,  
      tension: isCorrect ? 1 : -1, // -10 is Slow
      friction: isCorrect ? 1 : 2.5,  // 1  is Oscillate a lot
    }
    var action = isCorrect ? Animated.timing : Animated.spring;
		action(this.movementAnimation, settings).start(completeCallback);
  }

  isHorizontal(dir) {
  	return dir == 1 || dir == 3;
  }

  getImageStyle() {
    var radius = this.props.radius;
    var margin = this.props.margin;
    var style = [
      {
        shadowColor: '#000000',
        shadowOffset: {
          width: this.movementAnimation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 3, 0],
          }),
          height: this.movementAnimation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0],
          })
        },
        shadowRadius: 1,
        shadowOpacity: 0.4
      },
      {width: radius - margin, height: radius - margin},
      this.state.attacked && {
        opacity: this.fadeOutAnim,
        transform: [  
          {scale: this.fadeOutAnim}] // causes flickering 
      },
      (this.state.moveTo != null) && {
        transform: [  
          {scale: this.movementAnimation.interpolate({
            inputRange: [0, 0.4, 0.5, 0.55, 1],
            outputRange: [1, 1.2, 1.25, 1.3, 1],
          })}, 
          this.isHorizontal(this.state.moveTo) ?
          {translateX: this.movementAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, (radius + margin*2) * ((this.state.moveTo == 3) ? -1 : 1 )],
          })} :
          {translateY: this.movementAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, (radius + margin*2) * ((this.state.moveTo == 0) ? -1 : 1 )],
          })},
          
        ]}
    ];

    return style;
      // this one allows drag and drop
      // this.state.moving && {position: 'absolute', left: this.state.moveX - this.state.x0, top: this.state.moveY - this.state.y0},
  }

  render() {

		var radius = this.props.radius;
		var margin = this.props.margin;
		var containerStyle = [styles.cell];

		containerStyle.push({width: radius, height: radius, /*borderRadius: radius,*/ margin})
		!this.props.active && containerStyle.push(styles.empty)
		this.props.tapped && containerStyle.push(styles.tapped);
    (this.state.moveTo != null) && containerStyle.push(styles.animating);

		return (
			<View 
        style={containerStyle} 
        {...this._panResponder.panHandlers}
        //key={this.props.id}
      >
				<Animated.Image 
          source={FightersService.getImage(this.state.fighter)} 
          key={this.state.fighter}
					style={this.getImageStyle()}
					resizeMode='contain'
				/>
			</View>
		)
	}
}

var styles = StyleSheet.create({
	cell: {
	  backgroundColor: 'rgba(0,0,0,0.1)',
	 	alignItems: 'center',
	 	justifyContent: 'center',
    overflow:'visible'
	},
	rock: {
		backgroundColor: '#ff0000'
	},
	paper: {
		backgroundColor: '#00ff00'
	},
	scissors: {
		backgroundColor: '#0000ff'
	},
	newline: {},
	empty: {
		 backgroundColor: 'transparent',
	},
	moveonme: {},
	tapped: {},
	animating: {
		//backgroundColor: '#009900',
		zIndex: 100
	}
})