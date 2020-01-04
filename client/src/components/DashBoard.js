import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import JobApplications from '../components/JobApplications';
import ApplicationModal from '../components/ApplicationModal';
import { Container } from 'reactstrap';

export class DashBoard extends Component {
  render() {
    return (
      <div>
        <AppNavbar />
        <Container>
          <ApplicationModal />
          <JobApplications />
        </Container>
      </div>
    );
  }
}

export default DashBoard;
