import React, { Component } from 'react';
import { 
	View, 
	Text, 
	Image,
	StyleSheet,
	Dimensions, 
    ScrollView,
    FlatList,
	TouchableWithoutFeedback as TouchableElement,
} from 'react-native';
import px from '../utils/PixelSizeFixer'
import {leaderboardPage as styles} from 'styles';
import Leaderboard from 'components/Leaderboard'
import Background from 'components/Background'
import Topbar from 'components/Topbar'
import LevelsManager from '../models/LevelsManager'
import Auth from '../services/Auth'
import t from 'utils/i18n' 

class LeaderboardPage extends Component {

	constructor(props) {
		super(props);
		this.state = {}
		var params = this.params = this.props.navigation.state.params;
	}

	render() {
		var params = this.params;
		return (
			<Background>
				<View style={styles.container}>
					<Topbar title={t.t('levelLeaderboard.title')} />
					<View style={styles.topPart}>
						<Text style={styles.difficultyLabelText}>
							{t.t('levelLeaderboard.difficulty')} <Text style={styles.difficulty}>{LevelsManager.getDiffTitle(this.params.diff)}</Text>
						</Text>
						{!isNaN(this.params.id ) && (
						<Text style={styles.levelLabelText}>
							{t.t('levelLeaderboard.level')} {this.params.id + 1}
						</Text>
						)}
					</View>
					<View style={styles.leaderboard}>
						<Leaderboard diff={this.params.diff} id={this.params.id} selectedKey={Auth.getUser() && Auth.getId()}  />
					</View>
			    </View>
			</Background>
		)
	}
}


module.exports = LeaderboardPage;