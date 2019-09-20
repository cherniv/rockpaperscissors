'use strict';

import React from 'react';

export default class Background extends React.PureComponent {
	
	render() {
		return (
			this.props.children
		);
	}

}

module.exports = Background;