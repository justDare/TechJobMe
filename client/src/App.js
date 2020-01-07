import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import DashBoard from './components/DashBoard';
import LoginLanding from './components/auth/LoginLanding';
import Application from './components/applicationProfile/Application';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';
import PrivateRoute from './components/auth/PrivateRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Switch>
              <Route exact path="/" component={LoginLanding} />
              <PrivateRoute exact path="/dashboard" component={DashBoard} />
              <PrivateRoute exact path="/application" component={Application} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
