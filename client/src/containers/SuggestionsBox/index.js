import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import './style.css';

class SuggestionsBox extends Component {
  constructor(props) {
    super(props);

    this.handleSuggestionClick= this.handleSuggestionClick.bind(this);
  }

  render() {
    const { suggestions } = this.props;

    return (
      <div className="suggestions">
        {suggestions.map(suggestion => (
          <div
            className="suggestion"
            key={suggestion}
            onClick={(event) => this.handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </div>
        ))}
      </div>
    );
  }

  handleSuggestionClick(suggestion) {
    this.props.dispatchRouteChange(`/users/${suggestion}`);
  }
}

const mapStateToProps = state => ({
  suggestions: state.suggestions.list,
});

const mapDispatchToProps = dispatch => ({
  dispatchRouteChange: location => dispatch(push(location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SuggestionsBox);
