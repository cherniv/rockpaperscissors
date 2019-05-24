import {
	Platform,
	Dimensions,
} from 'react-native';

var {width, height} = Dimensions.get('window');
var OS = Platform.OS;
var isIos = OS == 'ios';
var isAndroid = OS == 'android';
var isWeb = OS == 'web';
var isMobileApp = isAndroid || isIos;
var isMobile = isMobileApp;
var select = (obj) => (isMobileApp && obj.mobile) || obj[OS];
export {
  OS,
	isAndroid,
	isIos,
	select,
	isMobileApp,
	isMobile,
	isWeb,
	width,
	height,
};
export default ({
	OS,
	isAndroid,
	isIos,
	select,
	isMobileApp,
	isMobile,
	isWeb,
	width,
	height,
})