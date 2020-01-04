import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import DashBoard from './components/DashBoard';
import LoginLanding from './components/auth/LoginLanding';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

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
            <Route exact path="/" component={LoginLanding} />
            <Route exact path="/dashboard" component={DashBoard} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
