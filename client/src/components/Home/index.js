import React from 'react';

import './style.css';
import SearchBar from '../../containers/SearchBar';
import SuggestionsBox from '../../containers/SuggestionsBox';

class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <h1 className="header">SoundCloud Analytics</h1>
        <SearchBar />
        <SuggestionsBox />
      </div>
    );
  }
};

export default Home;
