import {
} from 'react-native';

const noswipeback = {navigationOptions: { gesturesEnabled: false, }}
const ROUTES = {
  //EMPTY: {screen: require('routes/Empty')},
  HOME: {screen: require('../routes/MainMenu')},
  DIFFICULTIES_MENU: {screen: require('../routes/DifficultiesMenu')},
  LEVELS: {screen: require('../routes/Levels')},
  LEVEL: {screen: require('../routes/level'), ...noswipeback},
  LEVEL_SUCCESS: {screen: require('../routes/LevelSuccess'), ...noswipeback},
  DIFFICULTY_SUCCESS: {screen: require('../routes/DifficultySuccess')},
  LEADERBOARD_LEVEL: {screen: require('../routes/LeaderboardPage')},
  LEADERBOARD_DIFFICULTY: {screen: require('../routes/LeaderboardDifficultyPage')},
  SETTINGS: {screen: require('../routes/Settings')},
  FLAGS: {screen: require('../routes/Flags')},
  HELP: {screen: require('../components/Help')},
  //AD_PREPARE: {screen: require('../routes/AdPrepare')},
  PROFILE: {screen: require('../routes/UserPage')},
}

const KEYS = {};
Object.keys(ROUTES).forEach( i => KEYS[i] = i );

export  {ROUTES, KEYS};
