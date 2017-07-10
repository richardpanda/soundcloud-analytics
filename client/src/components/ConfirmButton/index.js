import { post } from 'axios';
import React, { Component } from 'react';

import './style.css';

class ConfirmButton extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <button className="confirm-button" onClick={this.handleClick}>
        <i className="fa fa-check" />
      </button>
    );
  }

  async handleClick(event) {
    const { setSuccess, user } = this.props;

    try {
      await post(`http://localhost:4000/api/users`, { permalink: user });
      setSuccess();
    } catch (error) {
      console.error(error);
    }
  }
}

export default ConfirmButton;
