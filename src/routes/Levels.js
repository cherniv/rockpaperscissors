import React, { Component } from 'react';
import { 
	View, 
	Text, 
	Image,
	StyleSheet,
	Dimensions, 
    ScrollView,
    ActivityIndicator,
	TouchableWithoutFeedback as TouchableElement,
} from 'react-native';
import LevelsManager from '../models/LevelsManager'
import px from '../utils/PixelSizeFixer'
import {BUTTON_PRESS} from '../actions';
import Button from '../components/Button';
import Background from '../components/Background'
import FightersService from '../services/FightersService'
import Topbar from '../components/Topbar'

const LEVELS_IN_TAB = 100;

var windowWidth = Dimensions.get('window').width;

class LevelsScene extends Component {

    constructor(props) {
        super(props);
        this.highlightCorrectThumb = this.highlightCorrectThumb.bind(this);
        this.diff = props.navigation.state.params.diff;
        this.state = {};
        LevelsManager.getDiff(this.diff); // preloading
    }

    componentWillMount() {
      
        this.setState({
            mounted: true,
        })
     
    }

    componentDidMount() {
      setTimeout(()=>{
        LevelsManager.getDiff(this.diff).then(data => {
            //console.log('GOT LEVELS:', data);
            var lastopened = LevelsManager.getLastOpenedIndex(this.diff);
            if (lastopened == data.length) lastopened --;
            var currentTab = Math.floor((lastopened)/LEVELS_IN_TAB);
            setTimeout(()=>
            this.setState({levels: data, lastopened, currentTab})
            );
        }).catch(e => console.log('something went wrong:', e));
      },15)
    }

	onPress(diff, id) {
		Actions.level({diff, id});
	}

    highlightCorrectThumb(e) {
        var x = e.nativeEvent.contentOffset.x;
        var i = Math.floor (x / windowWidth);
        this.setCurrentThumb(i);
    }

    setCurrentThumb(i) {
        this.setState({currentTab: i})
    }

    renderThumb(i) {
        return (
            <TouchableElement onPress={()=>this.onThumbPress(i)} key={'thumb'+i}>
                <View ref={'thumb'+i} style={[
                    styles.thumb, 
                    this.state.currentTab != i && styles.passiveThumb,
                    this.state.currentTab == i && styles.activeThumb,
                ]} key={0}>
                    <Text style={styles.thumbText}>{i*LEVELS_IN_TAB || 1}-{i*LEVELS_IN_TAB+LEVELS_IN_TAB}</Text>
                </View>
            </TouchableElement>
        )
    }

    onThumbPress = (i) => {
        this.tabs && this.tabs.scrollTo({x: i*windowWidth, animated: false});
        this.setCurrentThumb(i);
    }

    onTabsInit = (tabs) => {
        if (tabs) {
            this.tabs = tabs;
            setTimeout(()=>this.onThumbPress(this.state.currentTab))
        }
    }

	render() {
        
		var diff = this.diff;
		var tabs = [];
        var el;
        var thumbs = [];
    var levels = this.state.levels; 
    if (!levels) return null;
        var lastopened;
        var tabsLength;
        var subtitle = (
            <View style={[styles.label, styles.mainLabel]}>
                <Text style={styles.mainLabelText}>
                  
                </Text>
            </View>
        );

        if (levels) {
            lastopened = this.state.lastopened;
            tabsLength = Math.floor(levels.length / LEVELS_IN_TAB);
    		for (var i= 0; i < tabsLength; i ++ ) {
                var tablevels = levels.slice(i * LEVELS_IN_TAB, i * LEVELS_IN_TAB + LEVELS_IN_TAB);
                thumbs.push(this.renderThumb(i))
    			tabs.push(
    				<TabView 
    					key={"tab" + i} 
                        index={i} 
    					diff={diff} 
    					levels={tablevels} 
    					onPress={this.onPress.bind(this)}
                        lastOpened={lastopened}
    				/>
    			)
    		}

            thumbs = <View style={styles.thumbs} key='thumbs'>
                        {thumbs}
                    </View>

            tabs = <ScrollView 
                        //horizontal={true}
                        key='tabs'
                        ref={this.onTabsInit}
                        pagingEnabled={true} 
                        contentContainerStyle={{}}
                        onScroll={this.highlightCorrectThumb}
                        scrollEventThrottle={100}
                        >
                        {tabs}
                </ScrollView>

            el = <View style={styles.list}>{[
              //thumbs, 
              tabs
            ]}</View>;
        } else {
            el = <ActivityIndicator color='#ffffff' />;
        }

        el = <Background>
                <View style={styles.container}>
                    <Topbar 
                      title={LevelsManager.getDiffTitle(this.diff).toUpperCase()} 
                      home={true}
                      back={false}
                    />
                    {el}
                </View>
            </Background>

        return el;
    }

	_render() {
        
		var diff = this.diff;
		var tabs = [];
        var el;
        var thumbs = [];
		var levels = this.state.levels; 
        var lastopened;
        var tabsLength;
        var subtitle = (
            <View style={[styles.label, styles.mainLabel]}>
                <Text style={styles.mainLabelText}>
                  
                </Text>
            </View>
        );

        if (levels) {
            lastopened = this.state.lastopened;
            tabsLength = Math.floor(levels.length / LEVELS_IN_TAB);
    		for (var i= 0; i < tabsLength; i ++ ) {
                var tablevels = levels.slice(i * LEVELS_IN_TAB, i * LEVELS_IN_TAB + LEVELS_IN_TAB);
                thumbs.push(this.renderThumb(i))
    			tabs.push(
    				<TabView 
    					key={"tab" + i} 
                        index={i} 
    					diff={diff} 
    					levels={tablevels} 
    					onPress={this.onPress.bind(this)}
                        lastOpened={lastopened}
    				/>
    			)
    		}

            thumbs = <View style={styles.thumbs} key='thumbs'>
                        {thumbs}
                    </View>

            tabs = <ScrollView 
                        //horizontal={true}
                        key='tabs'
                        ref={this.onTabsInit}
                        pagingEnabled={true} 
                        contentContainerStyle={{}}
                        onScroll={this.highlightCorrectThumb}
                        scrollEventThrottle={100}
                        >
                        {tabs}
                </ScrollView>

            el = <View style={styles.list}>{[thumbs, tabs]}</View>;
        } else {
            el = <ActivityIndicator color='#ffffff' />;
        }

        el = <Background>
                <View style={styles.container}>
                    <Topbar title={LevelsManager.getDiffTitle(this.diff).toUpperCase()} />
                    {el}
                </View>
            </Background>

        return el;
    }
}

class TabView extends React.Component {
    render(){
    	//console.log('>', this.props.levels)
    	var levels = this.props.levels;
    	var el = [];
    	el = levels.map((item, i)=>{
    		var index = i + this.props.index * LEVELS_IN_TAB;
            
            var props = {
                key: this.props.diff + '' + index,
                iconSize: "16", 
                textStyle: styles.buttonText,
                style: [styles.button]
            }

            var children;

            if (item.passed  || (this.props.index * LEVELS_IN_TAB + i <= this.props.lastOpened)) {
                props.text = index + 1;
                props.onPressAction =  BUTTON_PRESS.START_LEVEL;
                props.onPressData = {diff: this.props.diff, id: index};
                if (item.passed) { 
                    props.style.push(styles.passedLevel);
                    if (item.whowon) children = (
                      <View style={styles.winnerFighterWrapper}>
                        {FightersService.getImage(item.whowon, styles.winnerFighter)}
                      </View>
                    )
                } else {
                    props.style.push(styles.currentLevel);
                    // children = (
                    //     <Text style={styles.currentLevelQuestionMark}>?</Text>
                    // )
                    // Randomly decorate  with question marks
                    /*
                    var len = 5 + Math.floor(Math.random() * 5);
                    children = []; for (var i = 0; i<len; i++ ) children.push(
                         <Text style={[
                                styles.currentLevelQuestionMark, 
                                {top: (Math.random()* 80) + '%', left: (Math.random()* 80) + '%'},
                                {opacity: 0.2 + Math.random() * 0.8},
                                //{transform: [{scale: 0.5 + Math.random()}]}
                                {fontSize: Math.random() * 30}
                            ]}>?</Text>
                    )
                    */
                }
            }
            else {
                props.icon="lock";
                props.style.push(styles.lockedLevel)
            }

            return (
                <Button {...props} >{children}</Button>
            )
    	})
    	
        return (
            <View style={styles.tab}>
               {el}
            </View>
        );
    }
}

var styles = require('../styles').levels;

module.exports = LevelsScene;