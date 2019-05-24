import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Router from './router/Router';
import FirebaseService from './services/FirebaseService';
import Auth from './services/Auth'
//import InAppPurchases from '../services/InAppPurchases'
//import AdPrepare from './routes/AdPrepare'
import Background from './components/Background'
console.disableYellowBox = true;

if((process.env.NODE_ENV || '').toLowerCase() === 'production'){
  // disable console. log in production
  console.log = function () {};
  console.info = function () {};
  console.warn = function () {};
  console.error = function () {}
  console.debug = function () {}
}

export default class App extends Component {

  render() {
    return (
      <Router />
    );
  }
}