
import {
  StyleSheet,
} from 'react-native';
import Device, {width, height} from '../utils/Device';
var px = require('../utils/PixelSizeFixer')

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  route: {
    ...Device.select({
      ios: {
        paddingTop: px(20),
      }
    }),
    backgroundColor: 'transparent',
  }
});

module.exports = styles;