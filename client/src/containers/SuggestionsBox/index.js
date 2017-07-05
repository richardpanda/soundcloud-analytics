import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.css';

class SuggestionsBox extends Component {
  render() {
    const { suggestions } = this.props;

    return (
      <div className="suggestions">
        {suggestions.map(suggestion => (
          <div className="suggestion" key={suggestion}>{suggestion}</div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  suggestions: state.suggestions.list,
});

export default connect(mapStateToProps)(SuggestionsBox);
