import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import './style.css';
import { query, suggestions } from '../../actions';

const { changeQuery } = query;
const { fetchSuggestions } = suggestions;

export class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = { query: '' };
    this.timeoutId = null;

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <form className="search-bar" onSubmit={this.handleSubmit}>
        <input
          className="search-input"
          name="query"
          onChange={this.handleQueryChange}
          pattern="[\w-]{3,255}"
          placeholder="Search for SoundCloud user"
          title="User must be between 3 and 255 characters. Only numbers, letters, underscores and hyphens are allowed."
          type="search"
          required
          autoComplete="off"
          list="suggestions"
        />
        <div className="button-wrapper">
          <button className="search-button" type="submit">
            <i className="fa fa-search" />
          </button>
        </div>
      </form>
    );
  }

  handleQueryChange(event) {
    event.persist();
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      const { dispatchChangeQuery, dispatchFetchSuggestions } = this.props;
      const query = event.target.value;

      this.setState({ query });
      dispatchChangeQuery(query);
      dispatchFetchSuggestions(query);
    }, 350);
  }

  handleSubmit(event) {
    event.preventDefault();

    const { dispatchRouteChange } = this.props;
    const { query } = this.state;

    dispatchRouteChange(`/users/${query}`);
  }
};

const mapDispatchToProps = dispatch => ({
  dispatchChangeQuery: query => dispatch(changeQuery(query)),
  dispatchFetchSuggestions: query => dispatch(fetchSuggestions(query)),
  dispatchRouteChange: location => dispatch(push(location)),
});

export default connect(null, mapDispatchToProps)(SearchBar);
