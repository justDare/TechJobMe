import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import JobApplications from '../components/JobApplications';
import ApplicationModal from '../components/ApplicationModal';
import { Container, Button, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteAllApplications } from '../actions/applicationActions';
import PromptModal from './PromptModal';

export class DashBoard extends Component {
  state = {
    promptModal: false,
    msg: null
  };

  static propTypes = {
    application: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    deleteAllApplications: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const application = this.props.application;

    // Alert when edit successful
    if (application !== prevProps.application) {
      this.setState({
        msg: application.msg
      });
      if (
        application.msg === 'All applications deleted successfully!' &&
        this.state.promptModal
      )
        this.togglePrompt();
    }
  }

  deleteAllApplications = () => {
    this.props.deleteAllApplications(this.props.user._id);
  };

  togglePrompt = () => {
    this.setState({
      promptModal: !this.state.promptModal
    });
  };

  render() {
    console.log(this.props.application);
    return (
      <div>
        <AppNavbar />
        <Container>
          {this.state.msg ? (
            <Alert color="success">{this.state.msg}</Alert>
          ) : null}
          <ApplicationModal />
          {this.props.application.applications.length ? (
            <Button color="danger" onClick={() => this.togglePrompt()}>
              Delete All Applications
            </Button>
          ) : (
            ''
          )}
          <JobApplications />
        </Container>
        <PromptModal
          modalAction={this.deleteAllApplications}
          toggle={this.togglePrompt}
          modal={this.state.promptModal}
          title="Delete All Applications"
          body="Are you sure you wish to delete all of your applications? All of them will be gone forever."
          cancel="No, I like them"
          confirm="Yes, delete all of my applications"
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  application: state.application,
  user: state.auth.user
});

export default connect(mapStateToProps, { deleteAllApplications })(DashBoard);
