import React from 'react';

import './style.css';

class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <h1 className="header">SoundCloud Analytics</h1>
        <form className="search-bar">
          <input className="search-input" type="search" placeholder="Search for SoundCloud user" />
          <button className="search-button">
            <i className="fa fa-search" />
          </button>
        </form>
      </div>
    );
  }
};

export default Home;
