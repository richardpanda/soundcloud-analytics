import React from 'react';

import './style.css';
import CancelButton from '../../containers/CancelButton';

const UserNotFound = ({ message, user }) => (
  <div className="user-not-found">
    <div>{message}</div>
    <div>Would you like us to track {user}?</div>
    <div className="user-not-found-buttons">
      <button className="check-button">
        <i className="fa fa-check" />
      </button>
      <CancelButton />
    </div>
  </div>
);

export default UserNotFound;
