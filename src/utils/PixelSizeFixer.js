import React from 'react';
import {
  PixelRatio,
} from 'react-native'
import Device from '../utils/Device';
var pixelRatio = PixelRatio.get();

var isAndroid = Device.isAndroid;

console.log('PIXEL RATIO::', pixelRatio)

export default (size) => {
    var n;
    if (pixelRatio == 2) {
        n =  size * (isAndroid ? 1.3 : 1.3);
    } else 
    if (pixelRatio == 3) {
        n = size * 1.4;
    } else 
    if (pixelRatio == 4) { // samsung galaxy 7
        n = size * 1.2;
    } else 
    if (pixelRatio == 2.625) { // google nexus 5x
        n = size * 1.5;
    } else {
        n = size ;
    }

    if (Device.isWeb && pixelRatio == 1) n = size * 1.2; 

    n = Math.floor(n);
        /*
    if (isAndroid) {
        n = Math.ceil(n);
    } else { 
        n = parseFloat(n.toFixed(2));
    }
    */

    //  n =   PixelRatio.roundToNearestPixel(size);

    return n;
}