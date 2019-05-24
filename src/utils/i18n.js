import I18n from 'react-native-i18n';  

I18n.fallbacks = true;

I18n.translations = {
  en: require('../translations/en'),
  ru: require('../translations/ru'),
};



var tt = (obj) => {
	var lang = I18n.currentLocale();
	if (lang.indexOf('ru') == 0) lang = 'ru';
	var str = obj[lang];
	str = str || obj['en'];
	return str;
}

export default {...I18n, tt }; 
