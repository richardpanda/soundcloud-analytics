import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.css';
import { query } from '../../actions';

const { changeQuery } = query;

export class SearchBar extends Component {
  constructor(props) {
    super(props);
    
    this.handleQueryChange = this.handleQueryChange.bind(this);
  }

  handleQueryChange(event) {
    this.props.dispatchChangeQuery(event.target.value);
  }

  render() {
    return (
      <form className="search-bar">
        <input
          className="search-input"
          name="query"
          onChange={this.handleQueryChange}
          placeholder="Search for SoundCloud user"
          type="search"
        />
        <button className="search-button">
          <i className="fa fa-search" />
        </button>
      </form>
    );
  }
};

const mapDispatchToProps = dispatch => ({
  dispatchChangeQuery: query => dispatch(changeQuery(query)),
});

export default connect(null, mapDispatchToProps)(SearchBar);
