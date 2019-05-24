import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {difficultiesMenu as styles} from '../styles';
import Button from '../components/Button';
import {BUTTON_PRESS} from '../actions';
import Background from '../components/Background'
import Topbar from '../components/Topbar'
import LevelsManager from '../models/LevelsManager'
import t from '../utils/i18n' 

class MainMenu extends Component {
  constructor(props) {
    super(props);
    var diffs = LevelsManager.getDiffsLabelsAndPercents();
    diffs.sort((d1, d2) => d1.order - d2.order)
    this.state = {diffs}
    //console.log('DIFFS', diffs)
  }
  render() {
    return (
      <Background>
      <Topbar title={t.t('difficultiesMenu.title')} />
        <View style={styles.container}>
          <View style={[styles.label, styles.mainSublabel]}>
            <Text style={styles.mainSublabelText}>
              {t.t('difficultiesMenu.choose')}
            </Text>
          </View>
          {this.state.diffs.map(diff => 
            <View style={styles.diff} key={diff.key}>
              <View style={styles.diffButtonWrapper}>
                <Button 
                  onPressAction={BUTTON_PRESS.START_DIFFICULTY}
                  onPressData={{diff: diff.key}}
                  text={t.tt(diff.titles).toUpperCase()}
                  //icon="game-controller"
                  //iconSize="18" 
                  style={styles.diffButton}
                  textStyle={styles.diffButtonText}
                >
                  <View style={styles.levelsProgress}><Text style={styles.levelsProgressText}>{diff.levelsProgress + '%'}</Text></View>
                </Button>
              </View>
              <Button 
                onPressAction={BUTTON_PRESS.DIFFICULTY_HIGHSCORE}
                onPressData={{diff: diff.key}}
                icon="trophy"
                iconSize="11" 
                style={styles.highscoreButton}
              />
            </View>
          )}
        </View>
      </Background>
    )
  }
}

module.exports = MainMenu;