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
import Icon from '../components/Icon';

const fadeOutDuration = 180;
const attackDuration = 200;

export default class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      attacked: props.attacked, 
      moveCorrect: props.moveCorrect, 
      fighter: props.fighter, 
      moveTo: props.moveTo,
      timestamp: props.timestamp,
    })
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
      onPanResponderMove: (a,b) => {
         var {x0 , y0, moveX, moveY} = b;
         this.setState({x0 , y0, moveX, moveY, moving: true});
         //console.log(x0 , y0, moveX, moveY)
      }
    });
  }

  runFadeOutAnimation() {
    this.fadeOutAnim = new Animated.Value(0.9);
    Animated.timing(                            
      this.fadeOutAnim,                      
      {
        duration: fadeOutDuration,
        toValue: 0.0,
        useNativeDriver: true,
      }
    ).start(); 
  }

  componentWillReceiveProps(props) {
    //this.movementAnimation && this.movementAnimation.stopAnimation();
    if (props.timestamp != this.state.timestamp) {
      this.fadeOutAnim && this.fadeOutAnim.stopAnimation();
      if (!this.state.fighter) this.movementAnimation = new Animated.Value(0);
    }
    

    if (this.state.fighter != props.fighter) {
      this.setState({fighter: props.fighter});
    }

    if (this.state.attacked != props.attacked) {
      if (props.attacked) {
        this.runFadeOutAnimation()
      }
      setTimeout(()=>this.setState({attacked: props.attacked}))
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
   // console.log('e', dx, dy, vx, vy)
    this.props.onSwipe(this.props.id, dir);
    this.setState({moving: false})
  }

  incorrectMovementAnimationEnded() {
    this.props.incorrectAnimationFinished(this.props.id);
  }

  correctMovementAnimationEnded() {
    this.props.attackingAnimationFinished(this.props.id, this.state.moveTo);
  }

  animate(dir, isCorrect, completeCallback) {
    var settings = {
      duration: attackDuration,
      toValue: isCorrect ? 1 : 0,   // Returns to the start
      velocity: isCorrect ? 5 : 5,  //Math.max(Math.abs(vx), Math.abs(vy)) / this.props.radius * 5,  
      tension: isCorrect ? 1 : -10, // -10 is Slow
      friction: isCorrect ? 1 : 3.5,  // 1  is Oscillate a lot
      useNativeDriver: true,
    }
    var action = isCorrect ? Animated.timing : Animated.spring;
    try {
    action(this.movementAnimation, settings).start(completeCallback);
    } catch (e) {}
  }

  isHorizontal(dir) {
    return dir == 1 || dir == 3;
  }

  getImageStyle() {
    var radius = this.props.radius;
    var margin = this.props.margin;
    var style = [{width: radius - margin, height: radius - margin}];
    if (this.state.moving) {
      var q = Math.max(Math.abs(this.state.moveX - this.state.x0), Math.abs(this.state.moveY - this.state.y0)) / 700;
      style.push({
          position: 'absolute', 
          left: (this.state.moveX - this.state.x0) / 18, 
          top: (this.state.moveY - this.state.y0) / 18,
          shadowOffset: {
          width: 1 + q,
          height: q + 2
        },
        shadowRadius: 1 - q ,
          transform: [  
          {scale: q + 1 }]
        })
      }
    else {
      var left = (this.state.moveX - this.state.x0) / 18;
      var top = (this.state.moveY - this.state.y0) / 18;
    style = style.concat([
      {
        shadowOffset: {
          width: this.movementAnimation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.5, 3, 0.5],
          }),
          height: this.movementAnimation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.5, 1, 0.5],
          })
        },
      },
      
      this.state.attacked && {
        opacity: this.fadeOutAnim,
        transform: [  
          {scale: this.fadeOutAnim}] // causes flickering 
      },
      (this.state.moveTo != null) && {
        transform: [  
          {scale: this.movementAnimation.interpolate({
            inputRange: [0,  0.4,  1],
            outputRange: this.state.moveCorrect ?  [1,  1.3,  1] : [1,  1.1, 1],
          })}, 
          {translateX: this.movementAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: this.state.moveCorrect ? 
              [ left, (radius + margin*2) * ((this.state.moveTo == 3) ? -1 : (this.state.moveTo == 1 ? 1 : 0 ) )]
            : [ 0,  left]
            ,
          }),
          translateY: this.movementAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: this.state.moveCorrect ? 
              [top, (radius + margin*2) * ((this.state.moveTo == 0) ? -1 : (this.state.moveTo == 2 ? 1 : 0 ) )]
            : [ 0, top]
            ,
          })},
          
        ]}
    ]);
  }
    //console.log((this.state.moveX - this.state.x0), (radius + margin*2) * ((this.state.moveTo == 3) ? -1 : (this.state.moveTo == 1 ? 1 : 0 ) ))
//console.log('<<<', 1 + Math.max(Math.abs(this.state.moveX - this.state.x0), Math.abs(this.state.moveY - this.state.y0)) / 600)
    return style;
      // this one allows drag and drop
      // this.state.moving && {position: 'absolute', left: this.state.moveX - this.state.x0, top: this.state.moveY - this.state.y0},
  }

  getContainerStyle() {
    var radius = this.props.radius;
    var margin = this.props.margin;
    var style = [styles.cell];
    !this.props.active && style.push(styles.empty)
    this.props.tapped && style.push(styles.tapped);
    if (this.state.moveTo != null) { 
      style.push([
        styles.animating, 
        this.state.moveCorrect && {padding: radius+margin, margin: -radius },
        !this.state.moveCorrect && {padding: radius/3, margin: -radius/3 + margin},
      ]);
    } else {
      style.push({width: radius, height: radius, margin,})
    }
    return style;
  }

  render() {
    var radius = this.props.radius;
    var margin = this.props.margin;
    var containerStyle =  this.getContainerStyle()
    var panHandlers = this.state.fighter ? this._panResponder.panHandlers : {};
    return (
      <View 
        style={containerStyle} 
        {...panHandlers}
        //key={this.props.id}
      >
        {this.props.active && <View style={[styles.bg, {
          marginBottom: -radius,
          width: radius, height: radius, borderRadius: radius}]} 
        />}
        {this.state.fighter && <Animated.View 
          //source={FightersService.getImage(this.state.fighter)} 
          key={this.state.fighter}
          style={[styles.iconWrapper, this.getImageStyle()]}
          shouldRasterizeIOS={true}
          //resizeMode='contain'
        >
          {FightersService.getImage(this.state.fighter, styles.icon)} 
        </Animated.View>}
      </View>
    )
  }
}

var styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    //overflow: 'hidden'
   // backgroundColor: 'rgba(255,0,0,0.1)',
  },
  iconWrapper: {
  //  backgroundColor: '#009900',
    alignItems: 'center',
    justifyContent: 'center', 
    zIndex: 2,
    shadowColor: '#000000',
    shadowRadius: 1,
    shadowOpacity: 0.2,
    shadowOffset: {
         width: 1,
         height: 1
     },
  },
  icon: {
    fontSize: px(20),
    color: '#ffffff'
  },
  bg: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000000',
    shadowRadius: 10,
    shadowOpacity: 0.8,
    shadowOffset: {
         width: 0,
         height: 0
     },
    zIndex: 1
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