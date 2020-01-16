import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
  ModalFooter
} from 'reactstrap';
import { deleteAllApplications } from '../actions/applicationActions';

export class DeleteAll extends Component {
  state = {
    modal: false,
    msg: null
  };

  static propTypes = {
    auth: PropTypes.object,
    error: PropTypes.object.isRequired,
    applications: PropTypes.array.isRequired,
    deleteAllApplications: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error !== prevProps.error) this.setState({ msg: error.msg });

    if (this.state.modal && !this.props.applications.length) this.toggle();
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  deleteAll = () => {
    const user_id = this.props.auth.user._id;
    this.props.deleteAllApplications(user_id);
  };

  render() {
    console.log(this.state);
    return (
      <div>
        <Button
          color="danger"
          style={{ marginBottom: '2rem' }}
          onClick={this.toggle}
        >
          Delete All Applications
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            Delete All Applications
          </ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            Are you sure? All your applications will be deleted, forever.
          </ModalBody>
          <ModalFooter>
            <Button
              color="dark"
              style={{ marginTop: '2rem' }}
              onClick={this.toggle}
              block
            >
              No, I like them
            </Button>
            <Button color="danger" onClick={this.deleteAll} block>
              Yes, delete all my applications
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  error: state.error,
  applications: state.application.applications
});

export default connect(mapStateToProps, { deleteAllApplications })(DeleteAll);
