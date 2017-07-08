import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import './style.css';
import { query, suggestions } from '../../actions';

const { changeQuery } = query;
const { fetchSuggestions } = suggestions;

export class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = { query: '' };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSubmit= this.handleSubmit.bind(this);
  }

  render() {
    return (
      <form className="search-bar" onSubmit={this.handleSubmit}>
        <input
          className="search-input"
          name="query"
          onChange={this.handleQueryChange}
          placeholder="Search for SoundCloud user"
          type="search"
          required
        />
        <button className="search-button" type="submit">
          <i className="fa fa-search" />
        </button>
      </form>
    );
  }

  handleQueryChange(event) {
    const query = event.target.value;
    this.setState({ query });
    this.props.dispatchChangeQuery(query);
    this.props.dispatchFetchSuggestions(query);
  }

  handleSubmit(event) {
    event.preventDefault();

    const { history } = this.props;
    const { query } = this.state;

    history.push(`/users/${query}`);
  }
};

const mapDispatchToProps = dispatch => ({
  dispatchChangeQuery: query => dispatch(changeQuery(query)),
  dispatchFetchSuggestions: query => dispatch(fetchSuggestions(query)),
});

export default withRouter(connect(null, mapDispatchToProps)(SearchBar));
