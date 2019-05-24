import React, {Component} from 'react';
import {
	Text,
	View, 
	Image,
	Animated,
	StyleSheet,
	Easing,
} from 'react-native';

import px from '../utils/PixelSizeFixer';
import Device from '../utils/Device';;
import FightersService from '../services/FightersService'

const ATTACK_DURATION = 3000;

class Loading extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Animated.View style={[styles.container]} >
				<Figure fighter={'scissors'} delay={0}  />
				<Figure fighter={'rock'} delay={300}  />
				<Figure fighter={'paper'} delay={600}  />
			</Animated.View>
		)
	}
}

class Figure extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fighter: props.fighter,
		}
		this.movementAnimation = new Animated.Value(0);
	}

	componentDidMount() {
		setTimeout(()=>
		this.animate()
		, this.props.delay);
	}

	animate = () => {
	  	var settings = {
	  		duration: ATTACK_DURATION,
	      	toValue: 1,
    		easing: Easing.linear,
    		useNativeDriver: true,
    		//delay: this.props.delay
	    }

	    var action = Animated.timing(this.movementAnimation, settings);

	    Animated.loop(action).start()
	}

	getImageStyle() {
	    var style = [
	      {
	        shadowColor: '#000000',
	        shadowOffset: {
	          width: this.movementAnimation.interpolate({
	            inputRange: [0, 0.75, 1],
	            outputRange: [0, 5, 0],
	          }),
	          height: this.movementAnimation.interpolate({
	            inputRange: [0, 0.75, 1],
	            outputRange: [0, 5, 0],
	          })
	        },
	        shadowRadius: 1,
	        shadowOpacity: 0.4
	      },
	      {
	        transform: [ 
	          	{translateY: this.movementAnimation.interpolate({
	            	inputRange: [0, 	0.2,   0.25,     0.3,   0.5,   0.75  , 1],
	  				outputRange: [0, px(-18), px(-20), px(-18),  0,   px(20),  0]
	          	})},
	        ]}
	    ];

    	return style;
      // this one allows drag and drop
      // this.state.moving && {position: 'absolute', left: this.state.moveX - this.state.x0, top: this.state.moveY - this.state.y0},
  }

	render() {
		return (
				<Animated.View 
          			key={this.state.fighter}
					style={[styles.figure, this.props.style,  this.getImageStyle()]}
				>
					{FightersService.getImage(this.state.fighter, styles.figure)} 
				</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		//backgroundColor: 'rgba(255,255,255,0.1)',
		alignItems: 'center',
		justifyContent: 'center',
		width: px(56),
		height: px(56),
		alignSelf: 'center',
		flexDirection: 'row'
	},
	
	label: {
		shadowColor: '#000000',
	  	shadowOffset: {
	    width: 0,
	    height: 0,
	  },
	  shadowRadius: 1,
	  shadowOpacity: 0.4,
	},
	labelText: {
		color: '#ffffff',
		fontWeight: 'bold',
		letterSpacing: 2,
		fontSize: px(32),
	},
	figure:  {
		width: px(18), 
		height: px(18),
		fontSize: px(18),
		backgroundColor: 'transparent',
	},
})

export default Loading;