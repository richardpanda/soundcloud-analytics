import React, { Component } from 'react';

import './style.css';
import ConfirmButton from '../ConfirmButton';
import CancelButton from '../../containers/CancelButton';

class UserNotFound extends Component {
  constructor(props) {
    super(props);

    this.state = { success: false };
    this.setSuccess = this.setSuccess.bind(this);
  }

  render() {
    const { message, user } = this.props;
    const { success } = this.state;

    if (success) {
      return (
        <div className="user-not-found">
          <div>We are now tracking {user}!</div>
          <div>Thank you for your contribution! <i className="fa fa-heart heart" /></div>
        </div>
      );
    }

    return (
      <div className="user-not-found">
        <div>{message}</div>
        <div>Would you like us to track {user}?</div>
        <div className="user-not-found-buttons">
          <ConfirmButton setSuccess={this.setSuccess} user={user} />
          <CancelButton />
        </div>
      </div>
    );
  }

  setSuccess() {
    this.setState({ success: true });
  }
}

export default UserNotFound;
