import React, { Component } from 'react';
import { connect } from 'react-redux';

class SuggestionsBox extends Component {
  render() {
    const { suggestions } = this.props;

    return (
      <ul>
        {suggestions.map(suggestion => <li key={suggestion}>{suggestion}</li>)}
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  suggestions: state.suggestions.list,
});

export default connect(mapStateToProps)(SuggestionsBox);
