import React from "react";
import AppNavbar from "./components/AppNavbar";
import JobApplications from "./components/JobApplications";
import ApplicationModal from "./components/ApplicationModal";
import { Container } from "reactstrap";

import { Provider } from "react-redux";
import store from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
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

export default App;
