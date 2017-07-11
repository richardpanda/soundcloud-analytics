import React, { Component } from 'react';

import './style.css';
import ConfirmButton from '../ConfirmButton';
import CancelButton from '../../containers/CancelButton';

class UserNotFound extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null, isUserCreated: false };
    this.setError = this.setError.bind(this);
    this.setUserCreated = this.setUserCreated.bind(this);
  }

  render() {
    const { message, user } = this.props;
    const { error, isUserCreated } = this.state;

    let content = (
      <div className="user-not-found-content">
        <div>{message}</div>
        <div>Would you like us to track {user}?</div>
        <div className="user-not-found-buttons">
          <ConfirmButton
            setError={this.setError}
            setUserCreated={this.setUserCreated}
            user={user}
          />
          <CancelButton />
        </div>
      </div>
    );

    if (isUserCreated) {
      content = (
        <div className="user-not-found-content">
          <div>We are now tracking {user}!</div>
          <div>Thank you for your contribution! <i className="fa fa-heart heart" /></div>
        </div>
      );
    }

    if (error) {
      if (error.status === 404) {
        content = (
          <div className="user-not-found-content">
            <div>Unable to find SoundCloud user:</div>
            <div>{user}</div>
          </div>
        );
      } else {
        content = (
          <div className="user-not-found-content">
            <div>{error.message}</div>
          </div>
        );
      }
    }

    return (
      <div className="user-not-found">
        {content}
      </div>
    );
  }

  setError(error) {
    this.setState({ error });
  }

  setUserCreated() {
    this.setState({ isUserCreated: true });
  }
}

export default UserNotFound;
