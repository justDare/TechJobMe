import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import JobApplications from '../components/JobApplications';
import ApplicationModal from '../components/ApplicationModal';
import DeleteAll from '../components/DeleteAll';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class DashBoard extends Component {
  static propTypes = {
    applications: PropTypes.array.isRequired
  };

  render() {
    return (
      <div>
        <AppNavbar />
        <Container>
          <ApplicationModal />
          {this.props.applications.length ? <DeleteAll /> : ''}
          <JobApplications />
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  applications: state.application.applications
});

export default connect(mapStateToProps, {})(DashBoard);
