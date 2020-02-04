import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  validatePasswordResetToken,
  forgotPasswordEmail,
  updatePasswordViaEmail
} from '../../actions/authActions';
import { Redirect } from 'react-router-dom';

// Material
import { Alert } from '@material-ui/lab';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

export class ResetPassword extends Component {
  state = {
    password: '',
    passwordCheck: '',
    email: '',
    pwdError: false,
    error: false,
    loading: true
  };

  static propTypes = {
    validatePasswordResetToken: PropTypes.func.isRequired,
    forgotPasswordEmail: PropTypes.func.isRequired,
    updatePasswordViaEmail: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { token } = this.props.match.params;
    this.props.validatePasswordResetToken(token);
  }

  componentDidUpdate(prevProps) {
    const { msg } = this.props.auth;

    //  If token is valid show component
    if (prevProps !== this.props) {
      if (msg === 'Token ok') {
        this.setState({
          loading: false,
          email: this.props.auth.user.email
        });

        //  If not valid show error
      } else if (msg === 'Password reset link invalid or expired.') {
        this.setState({
          loading: false,
          error: true
        });
      } else if (msg === 'Password updated.') {
      }
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    if (this.state.pwdError === true) this.setState({ pwdError: false });
  };

  onSubmit = e => {
    e.preventDefault();
    const { password, passwordCheck } = this.state;

    if (password !== passwordCheck) {
      this.setState({
        pwdError: true
      });
      return;
    }

    const _id = this.props.auth.user._id;
    const { token } = this.props.match.params;

    // Attempt to update password
    this.props.updatePasswordViaEmail({
      password: password,
      _id: _id,
      token: token
    });
  };

  render() {
    const { loading, error } = this.state;
    const { msg } = this.props.auth;

    // If response recieved success, redirect to login
    if (msg === 'Password updated.') {
      return <Redirect to="/" />;
    }

    if (loading) {
      return <div>Loading...</div>;
    } else if (error) {
      return <div>Error</div>;
    } else {
      return (
        <div>
          <Container>
            <div className="login-main">
              <Paper className="login-card" variant="outlined">
                <Typography className="mb-5 text-center" variant="h4">
                  Reset password
                </Typography>
                {this.state.msg ? (
                  <Alert color="danger">{this.state.msg}</Alert>
                ) : null}
                <form onSubmit={this.onSubmit}>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Password"
                    name="password"
                    type="password"
                    onChange={this.onChange}
                    required
                    fullWidth
                    error={this.state.pwdError}
                    helperText={
                      this.state.pwdError ? 'Passwords do not match' : ''
                    }
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Re-type password"
                    name="passwordCheck"
                    type="password"
                    onChange={this.onChange}
                    required
                    fullWidth
                    error={this.state.pwdError}
                    helperText={
                      this.state.pwdError ? 'Passwords do not match' : ''
                    }
                  />
                  <Button
                    type="submit"
                    color="primary"
                    style={{ marginTop: '2rem' }}
                    className="float-right"
                    block
                  >
                    Reset Password
                  </Button>
                </form>
              </Paper>
            </div>
          </Container>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  error: state.error
});

export default connect(mapStateToProps, {
  validatePasswordResetToken,
  forgotPasswordEmail,
  updatePasswordViaEmail
})(ResetPassword);
