import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { clearErrors } from '../../actions/errorActions';
import { forgotPasswordEmail } from '../../actions/authActions';
import { clearAuthMessage } from '../../actions/authActions';

export class ForgotPasswordModal extends Component {
  state = {
    modal: false,
    email: '',
    msg: null
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    forgotPasswordEmail: PropTypes.func.isRequired,
    clearAuthMessage: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, auth } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'EMAIL_NOT_IN_DB') {
        this.setState({ msg: error.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    if (this.state.modal && auth.msg === 'Recovery Email Sent!') {
      this.toggle();
      this.props.clearAuthMessage();
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal
    });
  };

  onChange = e => {
    e.preventDefault();
    this.setState({ email: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    // Attempt to send password reset
    this.props.forgotPasswordEmail({ email: this.state.email });
  };

  render() {
    return (
      <div>
        <div className="text-center">
          <span
            className="text-primary"
            onClick={this.toggle}
            style={{ cursor: 'pointer' }}
          >
            I Forgot My Password
          </span>
        </div>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            Send Password Reset Link
          </ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="name">Account Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="mb-3"
                  onChange={this.onChange}
                />
                <Button color="dark" style={{ marginTop: '2rem' }} block>
                  Send
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.error,
  auth: state.auth
});

export default connect(mapStateToProps, {
  clearErrors,
  forgotPasswordEmail,
  clearAuthMessage
})(ForgotPasswordModal);
