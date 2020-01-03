import React, { Component } from 'react';
import AppNavbar from './components/AppNavbar';
import JobApplications from './components/JobApplications';
import ApplicationModal from './components/ApplicationModal';
import { Container } from 'reactstrap';

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
        <div className="App">
          <AppNavbar />
          <Container>
            <ApplicationModal />
            <JobApplications />
          </Container>
        </div>
      </Provider>
    );
  }
}

export default App;
