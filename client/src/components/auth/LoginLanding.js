import React, { Component } from 'react';
import { Container, Alert } from 'reactstrap';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import './login.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { clearErrors } from '../../actions/errorActions';
import { clearAuthMessage } from '../../actions/authActions';

export class LoginLanding extends Component {
  state = {
    msg: null
  };

  static propTypes = {
    clearErrors: PropTypes.func.isRequired,
    clearAuthMessage: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { msg } = this.props.auth;
    if (msg !== prevProps.auth.msg) {
      // Check for register error
      if (msg === 'Recovery Email Sent!') {
        this.setState({ msg: msg });
      } else {
        this.setState({ msg: null });
      }
    }
  }
  render() {
    return (
      <div className="login-card">
        <Container>
          {this.state.msg ? (
            <Alert color="success">{this.state.msg}</Alert>
          ) : null}
        </Container>
        <LoginModal />
        <RegisterModal />
        <ForgotPasswordModal />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  clearErrors,
  clearAuthMessage
})(LoginLanding);
