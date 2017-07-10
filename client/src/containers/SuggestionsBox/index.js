import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.css';

class SuggestionsBox extends Component {
  render() {
    const { suggestions } = this.props;

    return (
      <datalist className="suggestions" id="suggestions">
        {suggestions.map(suggestion => (
          <option
            key={suggestion}
            value={suggestion}
          />
        ))}
      </datalist>
    );
  }
}

const mapStateToProps = state => ({
  suggestions: state.suggestions.list,
});

export default connect(mapStateToProps)(SuggestionsBox);
