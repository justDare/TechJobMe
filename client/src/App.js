import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import store from './store';
import DashBoard from './components/DashBoard';
import LoginLanding from './components/login/LoginLanding';
import { Provider } from 'react-redux';
import PrivateRoute from './components/login/PrivateRoute';
import PasswordReset from './components/login/ResetPassword';
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
