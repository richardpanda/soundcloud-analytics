import React, { Component } from 'react';

import './style.css';

class SearchBar extends React.Component {
  render() {
    return (
      <form className="search-bar">
        <input className="search-input" type="search" placeholder="Search for SoundCloud user" />
        <button className="search-button">
          <i className="fa fa-search" />
        </button>
      </form>
    );
  }
};

export default SearchBar;
