import React from 'react';

import {
	View,
	Text,
	Animated,
	StyleSheet,
	TouchableHighlight as TouchableElement
} from 'react-native';
import Dispatcher from '../dispatcher';
import px from '../utils/PixelSizeFixer';
import Icon from '../components/Icon';
import {buttonInnerWrapper as styles} from '../styles';

export default class ButtonComponent extends React.Component {
	constructor(props) {
		super(props);
		this.onPress = this.onPress.bind(this);
		this.blinkingAnimation = new Animated.Value(0)
		this.state = {blinking: false}
	}

	onPress() {
		if (this.props.onPress) {
			this.props.onPress();
		} else {
			if (this.props.onPressAction) {
				var action = {type: this.props.onPressAction}
				if (this.props.onPressData) action.data = this.props.onPressData ;
				Dispatcher.dispatch(action);
			}
		}
	}

	componentWillReceiveProps(props) {
		if (props.blinking && !this.state.blinking) {
			var action = Animated.timing(
	            this.blinkingAnimation,
	            {
	            	duration: 2000,
	                toValue: 1,
	                easing: Animated.easeInOut
	            }
	        )

	        Animated.loop(action).start();

	        this.setState({blinking: true})
		}

		if (!props.blinking && this.state.blinking) {

	        this.setState({blinking: false})
	        this.blinkingAnimation && this.blinkingAnimation.stopAnimation();
		}
	} 

	getBlinking() {
		if (!this.state.blinking) return;
		var backgroundColor = this.blinkingAnimation.interpolate({
	        inputRange: [0, 0.5, 1],
	        outputRange: ['rgba(255, 255, 255, 0.0)', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.0)']
	    });

    return ({backgroundColor});
	}

	renderHintPointer() {
		if (!this.state.blinking) return;
		return (
			<Animated.View style={[
					{position: 'absolute'},
					{opacity: this.blinkingAnimation.interpolate({
				        inputRange: [0, 0.5, 1],
				        outputRange: [0, 1, 0]
				    })},
		      		this.props.pointerFrom == 'top' && {transform: [ 
		      			{rotate: '180deg'}, 
		      			{translateY: px(42)}, 
		      			{translateX: px(4)}
		      		]},
		      		this.props.pointerFrom == 'bottom' && {transform: [ 
		      			{translateY: px(42)}, 
		      			{translateX: px(4)}
		      		]}
		      	]}>
		      	<Icon style={{
					fontSize: px(40),

					//width: px(100),
					color: '#ffffff' ,
					backgroundColor: 'transparent',
				}} name='pointer' family='EvilIcons' key='hand' />
				</Animated.View>
		)
	}

	render() {
		var text = !!this.props.text ? <Text style={this.props.textStyle} key='text'>{this.props.text}</Text> : null;
		var icon = this.props.icon && <Icon name={this.props.icon} style={{fontSize: px(this.props.iconSize), height: px(this.props.iconSize)}} key='icon' family={this.props.family} />;
		if (!icon) icon = this.props.customIcon;
		var disabled = !this.props.onPress && !this.props.onPressAction;
		var dir = this.props.dir || 'text-icon'
		return (
			<TouchableElement 
				onPress={!disabled && this.onPress || null} 
				underlayColor={!disabled && !this.props.nounderlay && 'rgba(255,255,255,0.2)' || null}
        //elevation={5}
        style={this.props.style}
			>
				<Animated.View style={[styles.animatedInnerContainer,this.getBlinking()]} >
	      		<View style={this.props.vertical ? styles.vertical : styles.horizontal}>
		      		{this.props.vertical ? [icon, text] : (dir == 'text-icon' ? [text, icon] : [icon, text])}
	      		</View>
	      			{this.props.children}
	      			 {this.renderHintPointer()}
	      		</Animated.View>
	      	</TouchableElement>
		);
	}
}
