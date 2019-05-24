import { NativeModules } from 'react-native';
const { InAppUtils } = NativeModules;


console.log('>>>>0', InAppUtils);

var STORE_KIT_ERRORS = {
  ESKERRORDOMAIN0: 'unknown',
  ESKERRORDOMAIN1: 'client_invalid',
  ESKERRORDOMAIN2: 'payment_canceled',
  ESKERRORDOMAIN3: 'payment_invalid',
  ESKERRORDOMAIN4: 'payment_not_allowed',
  ESKERRORDOMAIN5: 'store_product_not_available',
  ESKERRORDOMAIN6: 'cloud_service_permission_denied',
  ESKERRORDOMAIN7: 'cloud_service_network_connection_failed',
  ESKERRORDOMAIN8: 'unknown'
};

var products = [
	'com.bioludus.rockpaperscissors.removeads',
	// 'com.bioludus.rockpaperscissors.RemoveAds',
	// 'Remove Ads',
	// 'com.bioludus.rockpaperscissors.1324210055',
	// 'RemoveAds',
 //   '1324210055',
 //   //1324210055, // this format causes errors
 //   'com.bioludus.rockpaperscissors'
];

InAppUtils.loadProducts(products, (error, _products) => {
   //update store here.
   if (error){
   console.log('loadProducts ERROR1', error);
  if (error.code) console.log('loadProducts ERROR2', STORE_KIT_ERRORS[error.code]);
   }
   console.log('loadProducts >>>>>>2', _products);
});

InAppUtils.canMakePayments((canMakePayments) => {
   if(!canMakePayments) {
      console.log('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on device');
   } else {
   	//alert('PAYMENTS ALLOWED')
   }
})

module.exports = {}