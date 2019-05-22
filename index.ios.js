/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import {
  AppRegistry,
} from 'react-native';

import rps from './js/app'
console.ignoredYellowBox = ['Warning: BackAndroid']

AppRegistry.registerComponent('rps', () => rps);