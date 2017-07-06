import 'font-awesome/css/font-awesome.min.css';
import 'normalize.css';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';

import './style.css';
import Home from '../Home';
import UserPage from '../UserPage';

class App extends Component {
  render() {
    return (
      <div className="container">
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/users/:permalink' component={UserPage} />
        </Switch>
      </div>
    );
  }
}

export default App;
