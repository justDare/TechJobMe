import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import store from './store';
import DashBoard from './components/DashBoard';
import LoginLanding from './components/auth/LoginLanding';
import Application from './components/Application';
import Account from './components/account/Account';
import { Provider } from 'react-redux';
import PrivateRoute from './components/auth/PrivateRoute';
import PasswordReset from './components/auth/ResetPassword';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Switch>
              <Route exact path="/" component={LoginLanding} />
              <Route
                exact
                path="/forgot-password/:token"
                component={PasswordReset}
              />
              <PrivateRoute path="/dashboard" component={DashBoard} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
