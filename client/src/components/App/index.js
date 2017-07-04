import 'font-awesome/css/font-awesome.min.css';
import 'normalize.css';
import React from 'react';

import './style.css';
import Home from '../Home';

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Home />
      </div>
    );
  }
};

export default App;
