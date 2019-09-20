import {
  StyleSheet,
} from 'react-native';
import Device, {width, height} from '../utils/Device'
import HexToRgba from '../utils/HexToRgba'
import px from '../utils/PixelSizeFixer'
const C = StyleSheet.create;

const center = 'center';
const hidden = 'hidden';
const row = 'row';


const BAR_HEIGHT = px(50);

const LEVELS_MENU_PADDING = px(1);
const LEVELS_MENU_CELL_SIZE = px(32); //Math.floor((width - LEVELS_MENU_PADDING * 2) / 5);
const LEVELS_MENU_COLUMNS = 10
const fbColor = HexToRgba('#4267B1', 0.9);
const googleColor = HexToRgba('#DB4537', 0.9);

var flex = {
	flex: 1,
},
centeredContent = {
	alignItems: center,
  justifyContent: center,
},
transparent = {
	backgroundColor: 'transparent',
},
button = {
	borderWidth: 1,
	borderStyle: 'solid',
	borderColor: '#ffffff',
	borderRadius: px(4),
	shadowColor: '#000000',
	shadowOffset: {
	    width: 0,
	    height: 1,
	},
	shadowRadius: 0.6,
	shadowOpacity: 0.3,
  ...centeredContent,
  ...Device.select({
    web: {
      boxShadow: 'inset 0 -1px rgba(0,0,0,0.1)'
    }
  })
},
buttonWhite = {
	backgroundColor: 'rgba(255,255,255,0.1)',
},
buttonBlack = {
	backgroundColor: 'rgba(0,0,0,0.05)',
},
noBorder = {
	borderColor: 'transparent',
	borderWidth: null,
},
buttonText = {
	color: '#ffffff',
	fontFamily: "Open Sans",
},
bold = {
	fontWeight: 'bold',
},
squareButton = {
	width: px(42),
	height: px(42),
	//overflow: hidden,
},
roundButton = {
	width: px(42),
	height: px(42),
	borderRadius: px(21),
	//overflow: hidden,
},
smallSquareButton = {
	width: px(30),
	height: px(30),
},
squareButtonText = {
	fontSize: px(10),
	letterSpacing: (0),
	textAlign: center,
	lineHeight: px(11),
	marginTop: px(4),
},
bar = {
	width: '100%',
	height: BAR_HEIGHT,
	paddingHorizontal: px(4),
	flexDirection: 'row',
	...centeredContent,
},
barButton = {
	marginHorizontal: px(4),
},
mainButton = {
	...button,
	...buttonWhite,
	paddingVertical: px(8),
	paddingLeft: px(20),
	paddingRight: px(20),
	elevation: 1.4, // ANDROID, need to test
	alignSelf: center,
	margin: px(4),
},
mainButtonText = {
	...buttonText,
	fontSize: px(12),
	letterSpacing: px(1),
	marginHorizontal: px(10),
	marginTop: -1,
},
whiteText = {
	color: '#ffffff',
},
shadowForText = {
	textShadowColor: 'rgba(0, 0, 0, 0.4)',
  textShadowOffset: {width: 0, height: 0.4},
  textShadowRadius: 2
},
mainLabel = {
	paddingTop: px(20),
	paddingBottom: px(8),
},
mainLabelText = {
  ...buttonText,
  ...shadowForText,
	fontSize: px(20),
	textAlign: center,
}, 
mainSublabel = {
	marginBottom: px(8),
},
mainSublabelText = {
  ...buttonText,
  ...shadowForText,
	fontSize: px(16),
	textAlign: center,
	lineHeight: px(18)
},
mainSublabelAfterButton = {
	marginTop: px(20)
},
backButton = {
	...button,
	...buttonWhite,
	...smallSquareButton,
	...barButton,
}

export const buttonInnerWrapper = C({
  horizontal: {
    flexDirection: 'row',
    alignItems: center,
  },
  vertical: {
	  alignItems: center,
  },
  animatedInnerContainer: {
    flex: 1, 
    flexDirection: 'row', 
    width: '100%', 
    alignItems: center,
    justifyContent: center,
  }
});

export const 
	levels = C({
		container: {
        flex: 1,
        
    },
    list: {
    	...flex,
      ...centeredContent,
      
    },
    mainLabel: {
			...mainLabel,
		},
		mainLabelText: {
			...mainLabelText,
		},
		button: {
			...button, 
			...buttonWhite,
			width: LEVELS_MENU_CELL_SIZE - LEVELS_MENU_PADDING, 
			height: LEVELS_MENU_CELL_SIZE - LEVELS_MENU_PADDING,
			margin: LEVELS_MENU_PADDING/2,
      overflow: 'hidden',
		},
		lockedLevel: {
			//shadowColor: 'transparent',
			borderColor: 'rgba(255,255,255,0.2)',
			transform: [{scale: 0.8}]
		},
		passedLevel: {
			
			borderColor: 'rgba(255,255,255,0.8)',
      opacity: 0.9,
      
		},
		currentLevel: {
			//backgroundColor: 'rgba(255,255,255,0.1)',
			borderWidth: px(2),
			borderRadius: px(4),
		},
		buttonText: {...buttonText},
		tab: {
      width: LEVELS_MENU_CELL_SIZE * LEVELS_MENU_COLUMNS,
        backgroundColor: '#009900',
        //paddingHorizontal: LEVELS_MENU_PADDING,
        backgroundColor: 'transparent',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    thumbText: {
        textAlign: 'center',
        backgroundColor: '#aaaaaa',
        fontSize: px(8),
        backgroundColor: 'transparent',
        color: '#ffffff'
    },
    thumb: {
        flex: 1,
        borderRadius: px(4),
        marginHorizontal: px(4),
        paddingVertical: px(3),
    },
    passiveThumb: {
        backgroundColor: 'rgba(255,255,255,0.0)',
    },
    activeThumb: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    thumbs: {
        paddingHorizontal: px(LEVELS_MENU_PADDING*2),
        flexDirection: 'row',
        marginTop: px(10),
        marginBottom: px(20),
    },
    winnerFighterWrapper: {
      position: 'absolute',
    	left: 0,
      top: 0,
      backgroundColor: '#000000',
      width: '100%',
      height: '100%',
      alignContent: center,
      justifyContent: center,
      alignItems: center,
      opacity: 0.05,
    },
    winnerFighter: {
    	
    	
      fontSize: px(28),
     
    },
    currentLevelQuestionMark: {
    	position: 'absolute',
    	right: -px(0),
    	top: -2,
    	fontSize: px(10),
    	color: '#ffffff',
    	opacity: 0.9,
    }
  });

export const 
	level = {
		container: {
			flex:1, 
			alignItems: center,
			justifyContent: center,
		},
		cellsContainerWrapper: {
			flex: 1,
			width: '100%',
			height: '100%',
			justifyContent: 'center',
			paddingBottom: BAR_HEIGHT,
			marginTop: px(12)
		},
		cellsContainer: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			alignSelf: center,
		},
		
	};

export const background = {
		container: {
	    flex: 1, 
	    width: '100%', 
	    height: '100%',

		},

		innerContainer: {
			...Device.select({
	      ios: {
	        paddingTop: px(17),
	      },
	    }),
			flex: 1, 
	    width: '100%', 
	    height: '100%',
	    paddingBottom: BAR_HEIGHT,
		},
		bottomPadding: {
			height: BAR_HEIGHT,
		},
		brightnessOverlay: {
			flex: 1,
			width: '100%',
			height: '100%',
			//backgroundColor: 'rgba(0,0,0,0.8)'
		}
  };

export const 
	levelTopbar = {
		container: {
			...bar
		},
		button: {
			...button,
			//...buttonBlack,
			...buttonWhite,
			...squareButton,
			...barButton,
		},
		buttonText: {
			...buttonText,
			...squareButtonText,
		},
		middleSection: {
			flex: 1,
      paddingHorizontal: px(5),
      alignItems: 'flex-end',
			//...centeredContent
		},
		hintIconImage: {
			//flex: 1, 
			marginHorizontal: px(4),
			//height: px(22),
			fontSize: px(22),
			marginTop: px(2)
		},
		timer: {
			...centeredContent,
			//alignItems: center,

		},
		timerText: {
			//textAlign: center,
      ...whiteText,
      ...shadowForText,
			fontSize: px(11),
			fontFamily: "Open Sans",
			lineHeight: px(16),
			textAlign: center,
			fontWeight: 'bold'
		},
		levelLabel: {
			...whiteText,
			fontSize: px(10),
			fontFamily: "Open Sans",
			lineHeight: px(12),
		},
		clockIcon: {fontSize: px(19), marginBottom: px(1) }
  };
  
export const 
	navbar = {
		container: {
			...bar,
			position: 'absolute',
			zIndex: 100,
			bottom: 0,
		},
		button: {
			...button,
			//...buttonBlack,
			...roundButton,
			...barButton,
			...noBorder,
		},
		buttonText: {
			...buttonText,
			...squareButtonText,
		},
	};

export const 
	mainMenu = C({
		container: {...flex,
			width: '100%',
		},
		mainLogo: {
			width: '100%',
			height: '52%',
		},
		bottomPart: {
			width: '80%',
			alignSelf: center
			//height: '60%',
			//alignItems: center,
		},
		startButton: {
			...mainButton,
		},
		startButtonText: {
			...mainButtonText,
			fontSize: px(14),
		},
		playAsGuestText: {
			...mainButtonText,
			fontSize: px(9),
		},
		loginButton: {
			...mainButton,
			width: '100%',
			paddingHorizontal: px(10),
		},
		loginButtonText: {
			...mainButtonText,
		},
		guestLoginButton: {
			//width: null
		},
		facebookLoginButton: {
			backgroundColor: fbColor,
		},
		googleLoginButton: {
			backgroundColor: googleColor,
		}
	});

export const 
	navigator = C({
	  container: { ...flex,  backgroundColor: '#E6B077',},
	  route: {
	    //...transparent,
	    //backgroundColor: '#E6B077',
	    shadowColor: 'transparent',
	   //  shadowColor: '#000000',
		  // shadowOffset: {
		  //   width: 0,
		  //   height: 0
		  // },
		  // shadowRadius: 2,
		  // shadowOpacity: 0.5,
	  }
	});

export const
	levelSuccess = C({
		container: {
			...flex,
			alignItems: center,
		},
		nextButton: {
			...mainButton,
		},
		nextButtonText: {
			...mainButtonText,
			marginRight: px(6),
			fontSize: px(18)
		},
		mainLabel: {
			...mainLabel,
		},
		mainLabelText: {
			...mainLabelText,
		},
		mainSublabel: {
			...mainSublabel,
			width: '86%'
		},
		mainSublabelText: {
			...mainSublabelText,
		},
		highscoreButton: {
			...mainButton,

		},
		highscoreButtonText: {
			...mainButtonText,
			fontSize: px(12),
			marginRight: px(6),
		},
		mainSublabelAfterButton: {
			...mainSublabelAfterButton
		},
		currentLeaderWrapper: {
			height: px(32)
		},
		sublabelText: {
			fontSize: px(11),
			textAlign: center,
			...whiteText,
			lineHeight: px(14)
		}
	});

export const
	difficultiesMenu = C({
		container: {
      ...flex,
      alignItems: center,
			justifyContent: center,
		},
		diff: {
			flexDirection: 'row', 
			width: '90%', 
			height: px(36), 
			alignItems: 'center',
			alignSelf: 'center',
			marginVertical: px(2),
		},
		diffButton: {
			...mainButton,
			paddingVertical: px(8),
			width: '100%',
			flexDirection: 'row',
		},
		diffButtonWrapper: {
			flex: 1,
			marginHorizontal: px(2),
		},
		diffButtonText: {
			...mainButtonText,
			//marginHorizontal: 0
		},
		levelsProgress: {
			flex:1 
		},
		levelsProgressText: {
			textAlign: 'right',
			...whiteText,
		},
		mainLabel: {
			...mainLabel,
		},
		mainLabelText: {
			...mainLabelText,
		},
		mainSublabel: {
			...mainSublabel,
		},
		mainSublabelText: {
			...mainSublabelText,
		},
		highscoreButton: {
			...button,
			...buttonWhite,
			...smallSquareButton,
			marginHorizontal: px(2),
		}
	});

export const
	leaderboardPage = {
		container: {
			...flex,
			justifyContent: center,
			height: '100%',
			//marginBottom: BAR_HEIGHT ,
		},
		topPart: {
			...shadowForText,
			height: px(46),
			width: '100%',
			alignItems: center,
			justifyContent: center
		},
		difficultyLabelText: {
			...whiteText,
			fontSize: px(14),
			fontFamily: "Open Sans",
		},
		difficulty: {
			...bold,
		},
		levelLabelText: {
			...whiteText,
			fontSize: px(14),
			fontFamily: "Open Sans",
		},
		leaderboard: {
			flex: 1,
		},
	};

export const
	leaderboard = C({
		
	})

export const
	leaderboardItem = C({
		itemContainer: {
			flexDirection: 'row',
			height: px(32),
			alignItems: center,
			width: '100%',
			paddingRight: '5%',
			overflow: hidden,
		},
		touchableWrapper: {
			width: '100%',
		},
		positionContainer: {
			width: px(32),
			justifyContent: center,
			alignItems: 'flex-end'
		},
		positionIcon: {
			width: px(22),
			height: px(22),
			borderRadius: px(11),
			backgroundColor: '#ffffff',
			alignItems: center,
			justifyContent: center,
			borderColor: '#ffffff',
			borderStyle: 'dotted',
			borderWidth: 1,
		},
		flagContainer: {
			marginRight: px(8),
			...button,
			overflow: hidden,
			width: px(16),
		},
		flag: {
			width: px(17),
			height: px(10),
		},
		scoreContainer: {
			width: px(46),
		},
		scoreText: {
			...whiteText,
			textAlign: center,
		},
		usernameContainer: {
			
		},
		usernameText: {
			color: '#ffffff',
			fontFamily: 'Open Sans',
			//fontSize: px(9),
		},
		selectedItemContainer: {
			backgroundColor: 'rgba(255,255,255,0.2)'
		},
		transparent: {
			backgroundColor: 'transparent'
		}
	});

export const
	topbar = C({
		container: {
			...bar,
			backgroundColor: 'rgba(255,255,255,0.2)',
			marginBottom: px(18),
		},
		backButton: {
			...backButton,
		},
		buttonText: {
			...buttonText,
			...squareButtonText,
		},
		title: {
			fontSize: px(15),
			...shadowForText,
			...bold,
			...whiteText,
			flex: 1,
			textAlign: center,
		},
		rightSpace: {
			width: px(36),
			aspectRatio: 1,
		}
	});

export const
	settings = C({
		container: {
			...flex,
		},
		item: {
			marginVertical: px(12),
			width: '80%',
			//backgroundColor: 'rgba(255,255,255,0.1)',
			alignItems: center,
			alignSelf: center
		},
		inlineItem: {
			flexDirection: 'row', 
			alignItems: 'center',
			//justifyContent: 'space-between',
			justifyContent: 'center'
		},
		title: {
			...shadowForText,
			marginHorizontal: px(7)
		},
		titleText: {
			...mainSublabelText,
		},
		flagContainer: {
			marginRight: px(8),
			...button,
			overflow: hidden,
			width: px(30),
		},
		flag: {
			width: px(32),
			height: px(19),
		},
		contactButton: {
			...button,
			//...buttonBlack,
			...buttonWhite,
			...squareButton,
			...barButton,
		},
		facebook: {
			backgroundColor: fbColor,
		},
		google: {
			backgroundColor: googleColor,
		}
	});

export const
	flags = C({
		container: {
			...flex
		},
		listWrapper: {
			flex: 1, 
			alignSelf: center,
			width: '100%',			
		},
		list: {
			alignItems: center,
			justifyContent: center,
		},
		item: {
			padding: px(8),
		},
		title: {
			...mainSublabel,
			flexDirection: row, 
			alignItems: center, 
			justifyContent: center
		},
		titleText: {
			...mainSublabelText,
		},
		flagContainer: {
			marginHorizontal: px(4),
			...button,
			overflow: hidden,
			width: px(30),
		},
		flag: {
			width: px(32),
			height: px(19),
		},
	});

export const
	help = C({
		container: {
			...flex,
			
		},
		label: {
			...mainSublabel,
			width: '100%',
			marginBottom: px(20),
		},
		labelText: {
			...mainSublabelText,
		},
		scheme: {
			width: px(100), 
			height: px(100),
			marginBottom: px(20),
		},
		slide: {
			flex: 1,
			paddingHorizontal: px(30),
			alignItems: center,
			justifyContent: center,
		 	//justifyContent: 'flex-start', 
		 	paddingBottom: px(30),

		},
		hintButton: {
			...button,
			...squareButton,
			alignSelf: center,
			marginBottom: px(16),
			
		},
		hintButtonText: {
			color: '#ffffff'
		},
		victoryExamplesWrapper: {
			alignSelf: center,
			justifyContent: center
		},
		victoryExample: {
			flexDirection: 'row',
			marginVertical: px(10)
		},
		V: {
			color: '#00aa00',
			fontSize: px(32),
			lineHeight: px(30),
			alignSelf: 'flex-start',
			//fontFamily: 'Arial',
			fontWeight: 'bold',
			marginLeft: px(-1),
			marginTop: px(-2),
			marginRight: px(-32),
		},
		X: {
			color: '#aa0000',
			fontSize: px(32),
			lineHeight: px(30),
			alignSelf: 'flex-start',
			//fontFamily: 'Arial',
			fontWeight: 'bold',
			marginLeft: px(-1),
			marginTop: px(-2),
			marginRight: px(-32),
		}
	});

export const
	adPrepare = C({
		container: {
			width: '100%', 
			height: '100%', 
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		tvIcon: {
			backgroundColor: 'transparent',
			width: '100%',
			textAlign: 'center',
		},
		label: {
			...mainSublabel,
			width: '80%',
		},
		labelText: {
			...mainSublabelText,
		},
		count: {
			color: '#ffffff',
			width: '100%',
			fontWeight: 'bold',
			fontSize: px(100),
			backgroundColor: 'transparent',
			marginTop: px(-190),
			textAlign: center
		},
		removeAdsButton: {
			marginTop: px(50),
			padding: px(10),
			...button,
			backgroundColor: 'rgba(0,255,0,0.1)'
		},
		removeAdsButtonText: {
			color: '#ffffff'
		}
	});

export const
	profilePage = C({
		container: {
			flex: 1,
			width: '100%', height: '100%', alignItems: 'center',
			justifyContent: 'space-around',
			paddingBottom: '10%',
		},
		userpicAndButton: {
			flexDirection: 'row', 
			alignItems: 'center',
		},
		userpic: {
			...shadowForText,
			backgroundColor: 'rgba(0,0,0,0.05)',
			width: px(120), 
			height: px(120), 
			borderRadius: px(60), 
			borderWidth: px(4), 
			borderColor: '#ffffff', 
			borderStyle: 'solid',
			alignItems: 'center',
			justifyContent: 'center', 
			overflow: 'hidden',
		},
		userpicImage: {
			width: px(120), 
			height: px(120),
		},
		usernameAndButton: {
			flexDirection: 'row', 
			alignItems: center,
			width: '80%',
			justifyContent: center
		},
		username: {
			...mainSublabel,
			//flex: 1,
			//minHeight: px(18),
			alignItems: center,
			justifyContent: center,
			alignSelf: center,
			//height: '100%',
			width: '100%'
		},
		usernameTextInput: {
			...mainSublabelText,
			height: px(18),
			fontSize: px(16),
			width: '100%',
			alignSelf: center,
			backgroundColor: 'rgba(0,0,0,0.1)',
			...Device.select({
				android: {
					padding: 0,
				}
			})
			//flex: 1,
		},
		usernameText: {
			...mainSublabelText,
			...shadowForText,
			//height: px(18),
			fontSize: px(18),
			lineHeight: px(20),
			//width: '100%',
			//alignSelf: center
			//flex: 1,
			alignItems: center,
			padding: 0,
		},
		flagWrapper: {
			...shadowForText,
		},
		flagContainer: {
			...button,
			overflow: hidden,
			width: px(30),
		},
		flagAndButtonWrapper: {
			flexDirection: 'row', 
			alignItems: 'center'
		},
		flag: {
			width: px(32),
			height: px(19),
			...shadowForText,
		},
		levelsPassedLabel: {
			...mainSublabel,
			width: '80%',
			minHeight: px(50),

		},
		levelsPassedText: {
			...mainSublabelText,
			fontSize: px(14),
		},
		levelsPassedCount: {
			...mainSublabel,
			width: '80%',
			marginTop: px(1),
			paddingTop: 0,
		},
		levelsPassedCountText: {
			...buttonText,
			textAlign: center,
			fontSize: px(24),
			fontWeight: 'bold',
		},
		loginMotivation: {
			...mainSublabel,
			width: '80%',
			borderRadius: px(100),
			padding: px(10),
			borderColor: '#ffffff',
			borderStyle: 'dotted',
			borderWidth: 1,
			backgroundColor: 'rgba(255,255,222,0.1)'
		},
		loginMotivationText: {
			...mainSublabelText,
			fontSize: px(11),
		},
		button: {
			...button,
			...smallSquareButton,
			height: px(20),
			paddingHorizontal: px(0),
			marginLeft: px(1),
			...Device.select({
				ios: {
					marginRight: px(-35),
				}
			}),
			
			...noBorder,
		},
		buttonFirstTime: {
			...button,
			...mainButton,
			paddingHorizontal: px(0)
		},
		buttonText: {
			...mainButtonText,
			fontSize: px(12),
			//marginRight: px(6),
			marginHorizontal: 0,
			marginLeft: px(6)
		},
	});

