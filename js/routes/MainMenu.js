import React, { Component } from 'react';
import { 
	View,
	Text,
	Image,
  ActivityIndicator,
} from 'react-native';
import Button from 'components/Button';
import {mainMenu as styles} from 'styles';
import {BUTTON_PRESS} from 'actions';
import Background from 'components/Background'
import Auth from 'services/Auth'
import t from 'utils/i18n' 
//import Loading from 'components/Loading';

var mainLogo = {
  en: require('images/main_logo_centered_en.png'),
  ru: require('images/main_logo_centered_ru.png'),
}

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: Auth.getUser(),
      loading: false,
    }
    Auth.addChangeListener(this.onAuthStateChange)
  } 

  onAuthStateChange = (user) => {
    //console.log('AUTH STATE CHANGE', user);
    this.setState({user, loading: false})
  }

  componentWillMount() {
    
  }

  signedInAnonymously =(status) => {
    console.log('signedInAnonymously status:', status)
  }

  loadingEnd = () => {
     this.setState({loading: false})
  }

  loadingStart = () => {
    this.setState({loading: true})
  }

  render() {
    var buttons;
    var {user} = this.state;

    var startGameButton = (
      <Button key='startGameButton'
        onPressAction={BUTTON_PRESS.START_GAME}
        //onPressData={{}}
        text={t.t('mainMenu.start')}
        icon="game-controller"
        iconSize="18" 
        style={styles.startButton}
        textStyle={styles.startButtonText}
      />
    )

    var startAsGuestButton = (
      <Button key='startAsGuestButton'
        onPress={() => {
          this.loadingStart();
          Auth.signInAnonymously()
            .then(this.loadingEnd)
            .catch(()=>this.loadingEnd())
          
            //.then(this.signedInAnonymously)
        }}
        //onPressData={{}}
        text={t.t('mainMenu.playAsGuest')}
        icon="face"
        iconSize="10" 
        family='MaterialIcons'
        style={[styles.loginButton, styles.guestLoginButton]}
        textStyle={styles.playAsGuestText}
        dir='icon-text'
      />
    )

    var startWithFacebookButton = (
      <Button key='startWithFacebookButton'
        onPress={() => {
          Auth.signInWithFacebook().catch(()=>this.loadingEnd())
          this.loadingStart();
            //.then(this.signedInAnonymously)
        }}
        //onPressData={{}}
        text={t.t('mainMenu.loginWithFacebook')}
        icon="logo-facebook"
        iconSize="11" 
        family='Ionicons'
        style={[styles.loginButton, styles.facebookLoginButton]}
        textStyle={styles.loginButtonText}
        dir='icon-text'
      />
    )

    var startWithGoogleButton = (
      <Button key='startWithGoogleButton'
        onPress={() => {
          Auth.signInWithGoogle().catch(()=>this.loadingEnd());
          this.loadingStart();
        }}
        //onPressData={{}}
        text={t.t('mainMenu.loginWithGoogle')}
        icon="logo-googleplus"
        iconSize="11" 
        family='Ionicons'
        style={[styles.loginButton, styles.googleLoginButton]}
        textStyle={styles.loginButtonText}
        dir='icon-text'
      />
    )

    var goodSet = [
          startGameButton,
        ];
    var badSet = [
          startWithFacebookButton,
          startWithGoogleButton,
          startAsGuestButton,
        ];

    if (user) {
      if (!user.isAnonymous) {
        buttons = goodSet;
      } else {
        buttons = badSet;
      }
    } else {
      buttons = badSet;
    }

    var bottomContent;
    if (this.state.loading) {
      bottomContent = <ActivityIndicator color='#ffffff' />
    } else {
      bottomContent = buttons;
    }

    return (
      <Background>
      <View style={styles.container}>
      	<Image key="logo"
      		resizeMode='contain' 
      		source={t.tt(mainLogo)} 
      		style={styles.mainLogo}
      	/>
      	<View style={styles.bottomPart} key="bottomPart">
	      	{bottomContent}
      	</View>
      </View>
      </Background>
    )
  }
}

module.exports = MainMenu;