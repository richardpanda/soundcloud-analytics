import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import './style.css';

export class CancelButton extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <button className="cancel-button" onClick={this.handleClick}>
        <i className="fa fa-times" />
      </button>
    );
  }

  handleClick(event) {
    const { dispatchRouteChange } = this.props;
    dispatchRouteChange('/');
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchRouteChange: location => dispatch(push(location)),
});

export default connect(null, mapDispatchToProps)(CancelButton);
